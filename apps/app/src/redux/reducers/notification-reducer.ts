import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@mokjang/models';
import { RootState } from '@/redux/store';
import { NotificationApi } from '@/api/notification/notification.api';
import { BLANK } from '@mokjang/constants';

type NotificationState = {
  notifications: Notification[];
  notificationUnreadCount: number;
  unread: boolean;
  // ✅ 커서/페이지네이션·요청 상태
  notificationCursor: string | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: NotificationState = {
  notifications: [],
  notificationUnreadCount: 0,
  unread: false,
  notificationCursor: null, // ✅ null이면 첫 페이지
  hasMore: true,
  loading: false,
  error: null,
};

export const fetchNotificationCount = createAsyncThunk<
  number,
  void,
  { state: RootState; rejectValue: string }
>('notification/fetchNotificationCount', async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const notificationApi = new NotificationApi();
    const response = await notificationApi.getNotificationUnreadCount();
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue(String(error));
  }
});

// ✅ 응답을 { items, nextCursor }로 통일
type FetchNotificationsResult = {
  items: Notification[];
  nextCursor: string | null;
};

export const fetchNotifications = createAsyncThunk<
  FetchNotificationsResult,
  void,
  { state: RootState; rejectValue: string }
>('notification/fetchNotifications', async (_, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const { unread, notificationCursor } = getState().notification;

  try {
    const api = new NotificationApi();
    const response = await api.getNotifications({
      cursor: notificationCursor ?? undefined, // undefined면 첫 페이지로 해석
      limit: 30,
      unread,
    });

    const data = response.data;
    const items: Notification[] = data.data;
    const nextCursor: string | null = data.nextCursor;

    return { items, nextCursor };
  } catch (error) {
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue(String(error));
  }
});

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnread(state, action: PayloadAction<boolean>) {
      state.unread = action.payload;
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    setNotificationCount(state, action: PayloadAction<number>) {
      state.notificationUnreadCount = action.payload;
    },
    // ✅ 필요 시 외부에서 초기화
    resetNotifications(state) {
      state.notifications = [];
      state.notificationCursor = null;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // count
      .addCase(fetchNotificationCount.fulfilled, (state, action) => {
        state.notificationUnreadCount = action.payload;
      })

      // list
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? '알 수 없는 오류가 발생했습니다.';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { items, nextCursor } = action.payload;

        // ✅ 기존 → 신규 append 후, 처음 등장한 id만 유지(순서 보존 + 중복 제거)
        const seen = new Set<string>();
        state.notifications = [...state.notifications, ...items].filter((n) => {
          const id = String(
            (n as any).id ?? (n as any)._id ?? JSON.stringify(n)
          );
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });

        // ✅ 커서/hasMore 갱신 (nextCursor가 있으면 더 있음)
        state.notificationCursor = nextCursor ?? BLANK; // BLANK 쓰시려면 유지
        state.hasMore = Boolean(nextCursor);
      });
  },
});

export const {
  setUnread,
  setNotifications,
  setNotificationCount,
  resetNotifications,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
