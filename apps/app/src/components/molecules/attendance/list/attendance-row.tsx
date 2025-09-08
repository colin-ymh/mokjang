import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';
import { setWorshipEnrollmentFilter } from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import {
  ALL,
  BLANK,
  DESTRUCTIVE,
  WORSHIP_ENROLLMENT,
  WORSHIP_PERIOD,
} from '@mokjang/constants';
import AttendanceRowView from './attendance-row.view';
import { DEFAULT_GROUP, Group, Worship } from '@mokjang/models';
import { getGroup } from '@/utils/group';
import {
  fetchWorships,
  setWorships,
} from '@/redux/reducers/filter/worship-filter-reducer';
import { WorshipsApi } from '@/api/worship/worships.api';
import {
  fetchWorshipStatistic,
  setTargetWorship,
  setTargetWorshipGroup,
} from '@/redux/reducers/target/target-worship-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getMonthsAfterDate,
  getMonthsBeforeDate,
  usePageRouter,
} from '@mokjang/utils';
import { AttendanceTableProps } from './attendance-table';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import axios from 'axios';

const AttendanceRow = ({
  isStatisticOpened,
  onClickStatisticChevron,
}: AttendanceTableProps) => {
  const router = usePageRouter();

  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const { targetWorship, targetWorshipGroup } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { worships } = useSelector((state: RootState) => state.worshipFilter);
  const { groups } = useSelector((state: RootState) => state.church);

  const worshipsApi = new WorshipsApi(false);

  // 그룹 모달 on off
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  const [worshipPeriod, setWorshipPeriod] = useState<WORSHIP_PERIOD>(
    WORSHIP_PERIOD.LAST_THREE_MONTH
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 목록 설정 모달 열기
  const onClickOpenGroupModal = () => {
    setIsGroupModalShown(true);
  };

  // 목록 설정 닫기
  const onClickCloseGroupModal = () => {
    setIsGroupModalShown(false);
  };

  // 최상위 그룹
  const [topLevelGroup, setTopLevelGroup] = useState<Group>(DEFAULT_GROUP);

  // 그룹 선택
  const onClickGroupItem = (id: string | null) => {
    const newGroup = id === ALL ? DEFAULT_GROUP : getGroup(id, groups);
    dispatch(setTargetWorshipGroup(newGroup));

    dispatch(
      setWorshipEnrollmentFilter({
        ...worshipEnrollmentFilter,
        [WORSHIP_ENROLLMENT.GROUP]: id || BLANK,
      })
    );

    setIsGroupModalShown(false);
  };

  // 예배 변경 이벤트
  const onClickWorshipItem = async (id: string) => {
    try {
      // 해당 예배의 그룹 범위에 따라 그룹 선택 초기화
      const response = await worshipsApi.getWorship({
        churchId,
        worshipId: id,
      });

      const newWorship: Worship = response.data.data;

      dispatch(setTargetWorship(newWorship));

      if (newWorship.worshipTargetGroups.length > 0) {
        const newGroup = getGroup(
          newWorship.worshipTargetGroups[0].group.id,
          groups
        );
        dispatch(setTargetWorshipGroup(newGroup));
        setTopLevelGroup(newGroup);

        dispatch(
          setWorshipEnrollmentFilter({
            ...worshipEnrollmentFilter,
            [WORSHIP_ENROLLMENT.GROUP]: newGroup.id || BLANK,
          })
        );
      } else {
        dispatch(setTargetWorshipGroup(DEFAULT_GROUP));
        setTopLevelGroup(DEFAULT_GROUP);
        dispatch(
          setWorshipEnrollmentFilter({
            ...worshipEnrollmentFilter,
            [WORSHIP_ENROLLMENT.GROUP]: BLANK,
          })
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        const status = data?.statusCode ?? error.response?.status;
        const message = data.message;

        if (status === 403) {
          router.push('/main/worship');
        }

        dispatch(setToastText(message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      }

      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 시작 날짜
  const onChangeFromDate = (date: Date | null) => {
    if (date) {
      setWorshipPeriod(WORSHIP_PERIOD.CUSTOM);

      const prevFromDate =
        worshipEnrollmentFilter[WORSHIP_ENROLLMENT.FROM_DATE];
      const currentToDate = worshipEnrollmentFilter[WORSHIP_ENROLLMENT.TO_DATE];
      let newToDate = currentToDate;

      if (prevFromDate && currentToDate) {
        // 기존 fromDate
        const prevFromDateObj = getDateFromDateString(prevFromDate);
        // 기존 toDate
        const currentToDateObj = getDateFromDateString(currentToDate);
        const threeMonthsAfterFromDate = getMonthsAfterDate(date, 3);

        // 새로운 fromDate에서 3개월 후가 현재 toDate보다 이전이면 toDate 조정
        if (threeMonthsAfterFromDate < currentToDateObj) {
          newToDate = getDateStringFromDate(threeMonthsAfterFromDate);
        }
        // 새로운 fromDate가 기존 toDate 이후라면
        // 기존 두 날짜의 간격만큼 재배치
        else if (date >= currentToDateObj) {
          // prevFromDate가 currentToDateObj를 넘어서는 일수만큼 더하기
          const daysDifference = Math.floor(
            (currentToDateObj.getTime() - prevFromDateObj.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const newToDateObj = new Date(
            date.getTime() + daysDifference * 24 * 60 * 60 * 1000
          );
          newToDate = getDateStringFromDate(newToDateObj);
        }
      }

      dispatch(
        setWorshipEnrollmentFilter({
          ...worshipEnrollmentFilter,
          [WORSHIP_ENROLLMENT.FROM_DATE]: getDateStringFromDate(date),
          [WORSHIP_ENROLLMENT.TO_DATE]: newToDate,
        })
      );
    }
  };

  // 종료 날짜
  const onChangeToDate = (date: Date | null) => {
    if (date) {
      setWorshipPeriod(WORSHIP_PERIOD.CUSTOM);

      const currentFromDate =
        worshipEnrollmentFilter[WORSHIP_ENROLLMENT.FROM_DATE];
      const prevToDate = worshipEnrollmentFilter[WORSHIP_ENROLLMENT.TO_DATE];
      let newFromDate = currentFromDate;

      if (currentFromDate && prevToDate) {
        // 기존 fromDate
        const currentFromDateObj = getDateFromDateString(currentFromDate);
        // 기존 toDate
        const prevToDateObj = getDateFromDateString(prevToDate);
        const threeMonthsBeforeToDate = getMonthsBeforeDate(date, 3);

        // 새로운 toDate에서 3개월 전이 현재 fromDate보다 이후면 fromDate 조정
        if (threeMonthsBeforeToDate > currentFromDateObj) {
          newFromDate = getDateStringFromDate(threeMonthsBeforeToDate);
        }
        // 새로운 toDate가 기존 fromDate 이전이라면
        // 기존 두 날짜의 간격만큼 재배치
        else if (date <= currentFromDateObj) {
          // 기존 fromDate와 toDate의 간격 계산
          const daysDifference = Math.floor(
            (prevToDateObj.getTime() - currentFromDateObj.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const newFromDateObj = new Date(
            date.getTime() - daysDifference * 24 * 60 * 60 * 1000
          );
          newFromDate = getDateStringFromDate(newFromDateObj);
        }
      }

      dispatch(
        setWorshipEnrollmentFilter({
          ...worshipEnrollmentFilter,
          [WORSHIP_ENROLLMENT.FROM_DATE]: newFromDate,
          [WORSHIP_ENROLLMENT.TO_DATE]: getDateStringFromDate(date),
        })
      );
    }
  };

  // 날짜 드롭다운
  const onChangeWorshipPeriodDropdown = (value: WORSHIP_PERIOD) => {
    setWorshipPeriod(value);
  };

  // 날짜 드롭다운 변경 이벤트
  const onChangeWorshipPeriod = (value: WORSHIP_PERIOD) => {
    switch (value) {
      case WORSHIP_PERIOD.THIS_WEEK:
        const thisWeekDate = new Date();
        thisWeekDate.setDate(thisWeekDate.getDate() - 7);

        dispatch(
          setWorshipEnrollmentFilter({
            ...worshipEnrollmentFilter,
            [WORSHIP_ENROLLMENT.FROM_DATE]: getDateStringFromDate(thisWeekDate),
            [WORSHIP_ENROLLMENT.TO_DATE]: getDateStringFromDate(new Date()),
          })
        );
        return;
      case WORSHIP_PERIOD.THIS_MONTH:
        const thisMonthDate = new Date();
        thisMonthDate.setDate(1);

        dispatch(
          setWorshipEnrollmentFilter({
            ...worshipEnrollmentFilter,
            [WORSHIP_ENROLLMENT.FROM_DATE]:
              getDateStringFromDate(thisMonthDate),
            [WORSHIP_ENROLLMENT.TO_DATE]: getDateStringFromDate(new Date()),
          })
        );
        return;
      case WORSHIP_PERIOD.LAST_MONTH:
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        lastMonthDate.setDate(1);
        const lastMonthLastDate = new Date();
        lastMonthLastDate.setDate(0);
        dispatch(
          setWorshipEnrollmentFilter({
            ...worshipEnrollmentFilter,
            [WORSHIP_ENROLLMENT.FROM_DATE]:
              getDateStringFromDate(lastMonthDate),
            [WORSHIP_ENROLLMENT.TO_DATE]:
              getDateStringFromDate(lastMonthLastDate),
          })
        );
        return;
      case WORSHIP_PERIOD.LAST_THREE_MONTH:
        dispatch(
          setWorshipEnrollmentFilter({
            ...worshipEnrollmentFilter,
            [WORSHIP_ENROLLMENT.FROM_DATE]: getDateStringFromDate(
              getMonthsBeforeDate(new Date(), 3)
            ),
            [WORSHIP_ENROLLMENT.TO_DATE]: getDateStringFromDate(new Date()),
          })
        );
        return;
      default:
        return;
    }
  };

  // 필터 정보가 변경될 때, 예배 목록들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialWorships = async () => {
      try {
        const result = await dispatch(fetchWorships());
        if (fetchWorships.fulfilled.match(result)) {
          dispatch(setWorships(result.payload));
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialWorships();
  }, []);

  // 출석 필터 Initialize
  useEffect(() => {
    // 예배 선택
    if (!targetWorship.id) {
      if (worships.length > 0) {
        onClickWorshipItem(worships[0].id);
      }
    }
    // 기간 선택
    if (
      !worshipEnrollmentFilter.toSessionDate ||
      !worshipEnrollmentFilter.fromSessionDate
    ) {
      setWorshipPeriod(WORSHIP_PERIOD.LAST_THREE_MONTH);
    }

    // 날짜 선택
  }, [worships]);

  useEffect(() => {
    if (targetWorship.worshipTargetGroups.length > 0) {
      setTopLevelGroup(targetWorship.worshipTargetGroups[0].group);
    }
  }, [targetWorship]);

  useEffect(() => {
    onChangeWorshipPeriod(worshipPeriod);
  }, [worshipPeriod]);

  // const fetchWorshipStatistic = async () => {
  //   if (targetWorship.id === BLANK) return;
  //   if (
  //     worshipEnrollmentFilter.fromSessionDate === BLANK ||
  //     worshipEnrollmentFilter.toSessionDate === BLANK
  //   )
  //     return;
  //
  //   try {
  //     const response = await worshipsApi.getWorshipStatistics({
  //       churchId,
  //       worshipId: targetWorship.id,
  //       groupId: !targetWorshipGroup?.id
  //         ? undefined
  //         : targetWorshipGroup.id === ALL
  //           ? undefined
  //           : targetWorshipGroup.id,
  //       from: worshipEnrollmentFilter.fromSessionDate,
  //       to: worshipEnrollmentFilter.toSessionDate,
  //     });
  //
  //     const worshipStatistic: WorshipStatistic = response.data;
  //
  //     dispatch(setTargetWorshipStatistic(worshipStatistic));
  //   } catch (error) {
  //     setThrownError(error instanceof Error ? error : new Error(String(error)));
  //   }
  // };

  useEffect(() => {
    dispatch(fetchWorshipStatistic());
  }, [
    targetWorshipGroup.id,
    targetWorship.id,
    worshipEnrollmentFilter.fromSessionDate,
    worshipEnrollmentFilter.toSessionDate,
  ]);

  const props = {
    isGroupModalShown,
    isStatisticOpened,
    topLevelGroup,
    worshipPeriod,
    onClickStatisticChevron,
    onClickGroupItem,
    onClickWorshipItem,
    onClickOpenGroupModal,
    onClickCloseGroupModal,
    onChangeFromDate,
    onChangeToDate,
    onChangeWorshipPeriodDropdown,
  };

  return (
    <>
      <AttendanceRowView {...props} />
    </>
  );
};

export default AttendanceRow;
