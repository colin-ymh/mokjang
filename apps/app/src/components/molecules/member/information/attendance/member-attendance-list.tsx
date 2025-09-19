import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import MemberAttendanceListView from './member-attendance-list.view';
import {
  DESTRUCTIVE,
  WORSHIP_ENROLLMENT,
  WORSHIP_PERIOD,
} from '@mokjang/constants';
import {
  DEFAULT_MEMBER_ATTENDANCE_STATISTIC,
  MemberAttendanceStatistic,
  Worship,
} from '@mokjang/models';
import { setTargetWorship } from '../../../../../redux/reducers/target/target-worship-reducer';
import { setWorshipEnrollmentFilter } from '../../../../../redux/reducers/filter/worship-enrollment-filter-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getMonthsAfterDate,
  getMonthsBeforeDate,
} from '@mokjang/utils';
import { WorshipsApi } from '../../../../../api/worship/worships.api';
import { MembersApi } from '../../../../../api/members/members.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

type MemberAttendanceListProps = {};

const MemberAttendanceList = ({}: MemberAttendanceListProps) => {
  const membersApi = new MembersApi(false);
  const worshipsApi = new WorshipsApi(false);

  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const [worships, setWorships] = useState<Worship[]>([]);

  const [statistic, setStatistic] = useState<MemberAttendanceStatistic>(
    DEFAULT_MEMBER_ATTENDANCE_STATISTIC
  );

  const [worshipPeriod, setWorshipPeriod] = useState<WORSHIP_PERIOD>(
    WORSHIP_PERIOD.LAST_THREE_MONTH
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const fetchWorships = async () => {
    try {
      const response = await membersApi.getMemberWorshipAvailable({
        churchId,
        memberId: targetMember.id,
      });

      const newWorships = response.data.data;
      setWorships(newWorships);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const fetchStatistics = async () => {
    if (!targetWorship.id) return;

    try {
      const response = await membersApi.getMemberWorshipStatistics({
        churchId,
        memberId: targetMember.id,
        worshipId: targetWorship.id,
      });

      const newStatistic = response.data.data;
      setStatistic(newStatistic);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    fetchWorships();
  }, [targetMember.id]);

  useEffect(() => {
    fetchStatistics();
  }, [targetMember.id, targetWorship.id]);

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
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
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

  useEffect(() => {
    onChangeWorshipPeriod(worshipPeriod);
  }, [worshipPeriod]);

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
      !worshipEnrollmentFilter.toSessionDate &&
      !worshipEnrollmentFilter.fromSessionDate
    ) {
      setWorshipPeriod(WORSHIP_PERIOD.LAST_THREE_MONTH);
    }

    // 날짜 선택
  }, [worships]);

  const props = {
    worships,
    statistic,
    worshipPeriod,
    onClickWorshipItem,
    onChangeFromDate,
    onChangeToDate,
    onChangeWorshipPeriodDropdown,
  };

  return (
    <>
      <MemberAttendanceListView {...props} />
    </>
  );
};

export default MemberAttendanceList;
