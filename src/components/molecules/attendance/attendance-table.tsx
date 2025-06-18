import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ORDER_DIRECTION } from '@/constants/constant';
import { WORSHIP_ENROLLMENT } from '@/constants/worship/worship-column';
import {
  setWorshipEnrollmentOrderBy,
  setWorshipEnrollmentOrderDirection,
} from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import AttendanceTableView from '@/components/molecules/attendance/attendance-table.view';

export type AttendanceTableProps = {
  onClickWorshipEnrollment: (attendanceId: string) => void;
  loadWorshipEnrollments: () => Promise<void>;
};

const AttendanceTable = ({
  onClickWorshipEnrollment,
  loadWorshipEnrollments,
}: AttendanceTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    worshipEnrollments,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  } = useSelector((state: RootState) => state.worshipEnrollmentFilter);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: WORSHIP_ENROLLMENT) => {
    let newOrderBy = id;

    if (newOrderBy !== worshipEnrollmentOrderBy) {
      dispatch(setWorshipEnrollmentOrderBy(newOrderBy));
      dispatch(setWorshipEnrollmentOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setWorshipEnrollmentOrderDirection(
          worshipEnrollmentOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
      );
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadWorshipEnrollments(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  ]);

  const props = {
    worshipEnrollments,
    onClickHeader,
    onClickWorshipEnrollment,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <AttendanceTableView {...props} />
    </>
  );
};

export default AttendanceTable;
