import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';
import { setWorshipEnrollmentFilter } from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import { WORSHIP_ENROLLMENT } from '@/constants/worship/worship-column';
import { BLANK } from '@/constants/constant';
import AttendanceRowView from '@/components/molecules/attendance/attendance-row.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getGroup } from '@/utils/group';
import {
  fetchWorships,
  setWorships,
} from '@/redux/reducers/filter/worship-filter-reducer';
import { WorshipsApi } from '@/api/worship/worships.api';
import { DEFAULT_WORSHIP, Worship } from '@/models/worship/worship';
import {
  setTargetWorship,
  setTargetWorshipGroup,
} from '@/redux/reducers/target/target-worship-reducer';
import { getDateStringFromDate } from '@/utils/date';

const AttendanceRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const { groups } = useSelector((state: RootState) => state.church);

  const worshipsApi = new WorshipsApi(false);

  // 그룹 모달 on off
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  const [fromDate, setFromDate] = useState<string>(BLANK);
  const [toDate, setToDate] = useState<string>(BLANK);

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

  // 시작 날짜
  const onChangeFromDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      setFromDate(newDate);
    }
  };

  // 종료 날짜
  const onChangeToDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      setToDate(newDate);
    }
  };

  // 기간 저장
  const onClickSavePeriod = () => {
    dispatch(
      setWorshipEnrollmentFilter({
        ...worshipEnrollmentFilter,
        [WORSHIP_ENROLLMENT.FROM_DATE]: fromDate,
        [WORSHIP_ENROLLMENT.TO_DATE]: toDate,
      })
    );
  };

  // 최상위 그룹
  const [topLevelGroup, setTopLevelGroup] = useState<Group>(DEFAULT_GROUP);

  // 그룹 선택
  const onChangeGroup = (id: string | null) => {
    const newGroup = getGroup(id, groups);
    dispatch(setTargetWorshipGroup(newGroup));

    dispatch(
      setWorshipEnrollmentFilter({
        ...worshipEnrollmentFilter,
        [WORSHIP_ENROLLMENT.GROUP]: id || BLANK,
      })
    );

    setIsGroupModalShown(false);
  };

  // 예배 선택
  const onChangeWorship = async (id: string) => {
    if (id === BLANK) {
      dispatch(setTargetWorship(DEFAULT_WORSHIP));

      dispatch(setTargetWorshipGroup(DEFAULT_GROUP));
      setTopLevelGroup(DEFAULT_GROUP);
      dispatch(
        setWorshipEnrollmentFilter({
          ...worshipEnrollmentFilter,
          [WORSHIP_ENROLLMENT.GROUP]: BLANK,
        })
      );

      return;
    }
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
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 필터 정보가 변경될 때, 예배 목록들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialWorships = async () => {
      try {
        const result = await dispatch(
          fetchWorships({ churchId, currentPage: 1 })
        );
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
  }, [churchId]);

  const props = {
    isGroupModalShown,
    topLevelGroup,
    onChangeGroup,
    onChangeWorship,
    onClickOpenGroupModal,
    onClickCloseGroupModal,
    onChangeFromDate,
    onChangeToDate,
    onClickSavePeriod,
  };

  return (
    <>
      <AttendanceRowView {...props} />
    </>
  );
};

export default AttendanceRow;
