import React, { ChangeEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import AttendanceInformationTableView from '@/components/molecules/attendance/information/attendance-information-table.view';
import { WORSHIP_ATTENDANCE_STATUS } from '@/models/worship/worship';
import { setWorshipAttendances } from '@/redux/reducers/filter/worship-attendance-filter-reducer';

export type AttendanceInformationTableProps = {
  loadWorshipAttendances: () => Promise<void>;
};

const AttendanceInformationTable = ({
  loadWorshipAttendances,
}: AttendanceInformationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    worshipAttendances,
    worshipAttendanceFilter,
    worshipAttendanceOrderBy,
    worshipAttendanceOrderDirection,
  } = useSelector((state: RootState) => state.worshipAttendanceFilter);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight) {
        loadWorshipAttendances(); // 데이터를 추가로 로드
      }
    }
  };

  // 출석 버튼 이벤트
  const onChangePresent = (value: boolean, attendanceId: string) => {
    const newAttendances = worshipAttendances.map((attendance) => {
      if (attendance.id === attendanceId) {
        return {
          ...attendance,
          attendanceStatus: value
            ? WORSHIP_ATTENDANCE_STATUS.PRESENT
            : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
        };
      }
      return attendance;
    });
    dispatch(setWorshipAttendances(newAttendances));
  };

  // 결석 버튼 이벤트
  const onChangeAbsent = (value: boolean, attendanceId: string) => {
    const newAttendances = worshipAttendances.map((attendance) => {
      if (attendance.id === attendanceId) {
        return {
          ...attendance,
          attendanceStatus: value
            ? WORSHIP_ATTENDANCE_STATUS.ABSENT
            : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
        };
      }
      return attendance;
    });
    dispatch(setWorshipAttendances(newAttendances));
  };

  // 특이사항 이벤트
  const onChangeNote = (
    event: ChangeEvent<HTMLTextAreaElement>,
    attendanceId: string
  ) => {
    const newNote = event.target.value;
    const newAttendances = worshipAttendances.map((attendance) => {
      if (attendance.id === attendanceId) {
        return {
          ...attendance,
          note: newNote,
        };
      }
      return attendance;
    });

    dispatch(setWorshipAttendances(newAttendances));
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    worshipAttendanceFilter,
    worshipAttendanceOrderBy,
    worshipAttendanceOrderDirection,
  ]);

  const props = {
    worshipAttendances,
    scrollRef,
    onScroll,
    onChangePresent,
    onChangeAbsent,
    onChangeNote,
  };

  return (
    <>
      <AttendanceInformationTableView {...props} />
    </>
  );
};

export default AttendanceInformationTable;
