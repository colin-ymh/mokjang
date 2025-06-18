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

const AttendanceRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const { groups } = useSelector((state: RootState) => state.church);

  // 그룹 모달 on off
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

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

  // 기간 저장
  const onClickSavePeriod = (startDate: string, endDate: string) => {
    dispatch(
      setWorshipEnrollmentFilter({
        ...worshipEnrollmentFilter,
        [WORSHIP_ENROLLMENT.FROM_DATE]: startDate,
        [WORSHIP_ENROLLMENT.TO_DATE]: endDate,
      })
    );
    setIsGroupModalShown(false);
  };

  // 그룹 필터
  const [group, setGroup] = useState<Group>(DEFAULT_GROUP);

  // 그룹 선택
  const onChangeGroup = (id: string | null) => {
    const newGroup = getGroup(id, groups);
    setGroup(newGroup);

    dispatch(
      setWorshipEnrollmentFilter({
        ...worshipEnrollmentFilter,
        [WORSHIP_ENROLLMENT.GROUP]: id || BLANK,
      })
    );

    setIsGroupModalShown(false);
  };

  // 예배 필터
  const [worshipId, setWorshipId] = useState<string | undefined>();

  // 상태 선택
  const onChangeWorship = (id: string) => {
    setWorshipId(id);
    dispatch(
      setWorshipEnrollmentFilter({
        ...worshipEnrollmentFilter,
        [WORSHIP_ENROLLMENT.WORSHIP]: id,
      })
    );
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
    group,
    worshipId,
    onChangeGroup,
    onChangeWorship,
    onClickOpenGroupModal,
    onClickCloseGroupModal,
    onClickSavePeriod,
  };

  return (
    <>
      <AttendanceRowView {...props} />
    </>
  );
};

export default AttendanceRow;
