import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@mokjang/models';
import { RootState } from '@/redux/store';
import { NotificationApi } from '@/api/notification/notification.api';

type NotificationState = {
  notifications: Notification[];
  notificationUnreadCount: number;
};

const initialState: NotificationState = {
  notifications: [],
  notificationUnreadCount: 0,
};

export const fetchNotificationCount = createAsyncThunk<
  number,
  void,
  { state: RootState; rejectValue: string }
>('notification/fetchNotificationCount', async (_, thunkAPI) => {
  const { getState, rejectWithValue, dispatch } = thunkAPI;

  try {
    const notificationApi = new NotificationApi();
    const response = await notificationApi.getNotificationUnreadCount();

    return response.data.data;
  } catch (error) {
    // 에러 토스트 처리 후, 리젝트 값 전달
    if (error instanceof Error) {
      // dispatch(setToastText(error.message));
      // dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      // dispatch(setIsToastShown(true));
      return rejectWithValue(error.message);
    }
    const message = String(error);
    // dispatch(setToastText(message));
    // dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
    // dispatch(setIsToastShown(true));
    return rejectWithValue(message);
  }
});

const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    setNotificationCount(state, action: PayloadAction<number>) {
      state.notificationUnreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationCount.fulfilled, (state, action) => {
      state.notificationUnreadCount = action.payload;
    });
  },
});

export const { setNotifications, setNotificationCount } =
  NotificationSlice.actions;
export default NotificationSlice.reducer;
