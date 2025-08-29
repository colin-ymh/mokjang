import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChurchScheduleSummary,
  DEFAULT_CHURCH_SCHEDULE_SUMMARY,
} from '../../models/schedule-summary/schedule-summary';
import { RootState } from '../store';
import { RANGE } from '../../constants/constant';
import { HomeApi } from '../../api/home/home.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from './toast-popup-reducer';
import { DESTRUCTIVE } from '../../constants/styles/color';

type ScheduleSummaryState = {
  churchScheduleSummary: ChurchScheduleSummary;
  churchRange: RANGE;
  myScheduleSummary: ChurchScheduleSummary;
  myRange: RANGE;
};

const initialState: ScheduleSummaryState = {
  churchScheduleSummary: DEFAULT_CHURCH_SCHEDULE_SUMMARY,
  myScheduleSummary: DEFAULT_CHURCH_SCHEDULE_SUMMARY,
  churchRange: RANGE.WEEKLY,
  myRange: RANGE.WEEKLY,
};

// 교회 스케줄 요약을 가져오고, fulfilled 시 자동으로 state에 반영되도록 함
export const fetchChurchScheduleSummary = createAsyncThunk<
  ChurchScheduleSummary,
  void,
  { state: RootState; rejectValue: string }
>('scheduleSummary/fetchChurchScheduleSummary', async (_, thunkAPI) => {
  const { getState, rejectWithValue, dispatch } = thunkAPI;

  try {
    const { churchId } = getState().church;
    const { churchRange } = getState().scheduleSummary;

    const homeApi = new HomeApi(false);
    const response = await homeApi.getScheduleStatus({
      churchId,
      range: churchRange,
      option: 'church',
    });

    return response.data.data;
  } catch (error) {
    // 에러 토스트 처리 후, 리젝트 값 전달
    if (error instanceof Error) {
      dispatch(setToastText(error.message));
      dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      dispatch(setIsToastShown(true));
      return rejectWithValue(error.message);
    }
    const message = String(error);
    dispatch(setToastText(message));
    dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
    dispatch(setIsToastShown(true));
    return rejectWithValue(message);
  }
});

export const fetchMyScheduleSummary = createAsyncThunk<
  ChurchScheduleSummary,
  void,
  { state: RootState; rejectValue: string }
>('scheduleSummary/fetchMyScheduleSummary', async (_, thunkAPI) => {
  const { getState, rejectWithValue, dispatch } = thunkAPI;

  try {
    const { churchId } = getState().church;
    const { myRange } = getState().scheduleSummary;

    const homeApi = new HomeApi(false);
    const response = await homeApi.getScheduleStatus({
      churchId,
      range: myRange,
      option: 'member',
    });

    return response.data.data;
  } catch (error) {
    // 에러 토스트 처리 후, 리젝트 값 전달
    if (error instanceof Error) {
      dispatch(setToastText(error.message));
      dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      dispatch(setIsToastShown(true));
      return rejectWithValue(error.message);
    }
    const message = String(error);
    dispatch(setToastText(message));
    dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
    dispatch(setIsToastShown(true));
    return rejectWithValue(message);
  }
});

const UserSlice = createSlice({
  name: 'churchScheduleSummary',
  initialState,
  reducers: {
    setChurchScheduleSummary(
      state,
      action: PayloadAction<ChurchScheduleSummary>
    ) {
      state.churchScheduleSummary = action.payload;
    },
    setMyScheduleSummary(state, action: PayloadAction<ChurchScheduleSummary>) {
      state.myScheduleSummary = action.payload;
    },
    setChurchRange(state, action: PayloadAction<RANGE>) {
      state.churchRange = action.payload;
    },
    setMyRange(state, action: PayloadAction<RANGE>) {
      state.myRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChurchScheduleSummary.fulfilled, (state, action) => {
      state.churchScheduleSummary = action.payload;
    });
    builder.addCase(fetchMyScheduleSummary.fulfilled, (state, action) => {
      state.myScheduleSummary = action.payload;
    });
  },
});

export const {
  setChurchScheduleSummary,
  setMyScheduleSummary,
  setChurchRange,
  setMyRange,
} = UserSlice.actions;

export default UserSlice.reducer;
