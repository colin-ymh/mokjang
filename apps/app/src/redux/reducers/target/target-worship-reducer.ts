import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_GROUP,
  DEFAULT_WORSHIP,
  DEFAULT_WORSHIP_STATISTIC,
  Group,
  Worship,
  WorshipStatistic,
} from '@mokjang/models';
import { RootState } from '../../store';
import { ALL, BLANK } from '@mokjang/constants';
import { WorshipsApi } from '../../../api/worship/worships.api';

type TargetWorshipState = {
  targetWorship: Worship;
  targetWorshipGroup: Group;
  targetWorshipStatistic: WorshipStatistic;
};

const initialState: TargetWorshipState = {
  targetWorship: DEFAULT_WORSHIP,
  targetWorshipGroup: DEFAULT_GROUP,
  targetWorshipStatistic: DEFAULT_WORSHIP_STATISTIC,
};

/** 예배 통계 불러오기 (파라미터 없음: 내부 상태로 처리) */
export const fetchWorshipStatistic = createAsyncThunk<
  WorshipStatistic,
  void,
  { state: RootState }
>(
  'targetWorship/fetchWorshipStatistic',
  async (_: void, { getState, rejectWithValue }) => {
    const state = getState();
    const { churchId } = state.church;
    const { targetWorship, targetWorshipGroup } = state.targetWorship;
    const { worshipEnrollmentFilter } = state.worshipEnrollmentFilter;

    const worshipsApi = new WorshipsApi(false);

    try {
      const response = await worshipsApi.getWorshipStatistics({
        churchId,
        worshipId: targetWorship.id,
        groupId:
          !targetWorshipGroup?.id || targetWorshipGroup.id === ALL
            ? undefined
            : targetWorshipGroup.id,
        from: worshipEnrollmentFilter.fromSessionDate,
        to: worshipEnrollmentFilter.toSessionDate,
      });

      // BE 응답 형태가 data 또는 data.data 중 어떤지에 맞춰 선택
      // 기존 코드에 맞추어 response.data 를 그대로 사용
      return response.data as WorshipStatistic;
    } catch (err) {
      return rejectWithValue('예배 통계 로딩 실패');
    }
  },
  {
    // 필요한 값이 없는 경우 네트워크 호출 자체를 스킵
    condition: (_: void, { getState }) => {
      const state = getState() as RootState;
      const { targetWorship, targetWorshipGroup } = state.targetWorship;
      const { worshipEnrollmentFilter } = state.worshipEnrollmentFilter;

      if (!targetWorship?.id || targetWorship.id === BLANK) return false;
      if (
        worshipEnrollmentFilter.fromSessionDate === BLANK ||
        worshipEnrollmentFilter.toSessionDate === BLANK
      )
        return false;

      // groupId는 없어도 되므로 여기선 막지 않음
      return true;
    },
  }
);

const TargetWorshipSlice = createSlice({
  name: 'targetWorship',
  initialState,
  reducers: {
    setTargetWorship(state, action: PayloadAction<Worship>) {
      state.targetWorship = action.payload;
    },
    setTargetWorshipGroup(state, action: PayloadAction<Group>) {
      state.targetWorshipGroup = action.payload;
    },
    setTargetWorshipStatistic(state, action: PayloadAction<WorshipStatistic>) {
      state.targetWorshipStatistic = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorshipStatistic.fulfilled, (state, action) => {
      state.targetWorshipStatistic = action.payload;
    });
    // 실패/취소 시에는 상태 변경 없이 무시해도 됨
  },
});

export const {
  setTargetWorship,
  setTargetWorshipGroup,
  setTargetWorshipStatistic,
} = TargetWorshipSlice.actions;

export default TargetWorshipSlice.reducer;
