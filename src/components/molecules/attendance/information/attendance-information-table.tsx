import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import AttendanceInformationTableView from '@/components/molecules/attendance/information/attendance-information-table.view';
import {
  WORSHIP_ATTENDANCE_STATUS,
  WorshipAttendance,
  WorshipEnrollment,
} from '@/models/worship/worship';
import { setWorshipAttendances } from '@/redux/reducers/filter/worship-attendance-filter-reducer';
import { BLANK } from '@/constants/constant';
import { WorshipAttendancesApi } from '@/api/worship/worship-attendances.api';
import { setWorshipEnrollments } from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';

export type AttendanceInformationTableProps = {
  loadWorshipAttendances: () => Promise<void>;
};

const AttendanceInformationTable = ({
  loadWorshipAttendances,
}: AttendanceInformationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );
  const {
    worshipAttendances,
    worshipAttendanceFilter,
    worshipAttendanceOrderBy,
    worshipAttendanceOrderDirection,
  } = useSelector((state: RootState) => state.worshipAttendanceFilter);
  const { worshipEnrollments } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );

  const worshipAttendancesApi = new WorshipAttendancesApi(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);

  // 컴포넌트 내부 최상단에 선언
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

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
  const onChangePresent = async (
    value: boolean,
    attendance: WorshipAttendance
  ) => {
    try {
      const newAttendances = worshipAttendances.map((attd) => {
        if (attd.id === attendance.id) {
          return {
            ...attendance,
            attendanceStatus: value
              ? WORSHIP_ATTENDANCE_STATUS.PRESENT
              : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
          };
        } else {
          return attd;
        }
      });
      dispatch(setWorshipAttendances(newAttendances));

      const newWorshipEnrollments = worshipEnrollments.map((enrollment) => {
        if (enrollment.id === attendance.worshipEnrollment.id) {
          let wasFound = false;

          const updatedWorshipAttendances = enrollment.worshipAttendances.map(
            (attd) => {
              if (attd.id === attendance.id) {
                wasFound = true;
                return {
                  ...attd,
                  attendanceStatus: value
                    ? WORSHIP_ATTENDANCE_STATUS.PRESENT
                    : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
                };
              }
              return attd;
            }
          );

          if (!wasFound) {
            updatedWorshipAttendances.push({
              ...attendance,
              sessionDate: targetWorshipSession.sessionDate,
              attendanceStatus: value
                ? WORSHIP_ATTENDANCE_STATUS.PRESENT
                : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
            });
          }

          return {
            ...enrollment,
            worshipAttendances: updatedWorshipAttendances,
          } as WorshipEnrollment;
        }
        return enrollment;
      });
      dispatch(setWorshipEnrollments(newWorshipEnrollments));

      await worshipAttendancesApi.editWorshipAttendance(
        {
          churchId,
          worshipId: targetWorship.id,
          sessionId: targetWorshipSession.id,
          attendanceId: attendance.id,
        },
        {
          attendanceStatus: value
            ? WORSHIP_ATTENDANCE_STATUS.PRESENT
            : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 결석 버튼 이벤트
  const onChangeAbsent = async (
    value: boolean,
    attendance: WorshipAttendance
  ) => {
    try {
      const newAttendances = worshipAttendances.map((attd) => {
        if (attd.id === attendance.id) {
          return {
            ...attendance,
            attendanceStatus: value
              ? WORSHIP_ATTENDANCE_STATUS.ABSENT
              : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
          };
        } else {
          return attd;
        }
      });
      dispatch(setWorshipAttendances(newAttendances));

      const newWorshipEnrollments = worshipEnrollments.map((enrollment) => {
        if (enrollment.id === attendance.worshipEnrollment.id) {
          let wasFound = false;

          const updatedWorshipAttendances = enrollment.worshipAttendances.map(
            (attd) => {
              if (attd.id === attendance.id) {
                wasFound = true;
                return {
                  ...attd,
                  attendanceStatus: value
                    ? WORSHIP_ATTENDANCE_STATUS.ABSENT
                    : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
                };
              }
              return attd;
            }
          );

          if (!wasFound) {
            updatedWorshipAttendances.push({
              ...attendance,
              sessionDate: targetWorshipSession.sessionDate,
              attendanceStatus: value
                ? WORSHIP_ATTENDANCE_STATUS.ABSENT
                : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
            });
          }

          return {
            ...enrollment,
            worshipAttendances: updatedWorshipAttendances,
          } as WorshipEnrollment;
        }
        return enrollment;
      });
      dispatch(setWorshipEnrollments(newWorshipEnrollments));

      await worshipAttendancesApi.editWorshipAttendance(
        {
          churchId,
          worshipId: targetWorship.id,
          sessionId: targetWorshipSession.id,
          attendanceId: attendance.id,
        },
        {
          attendanceStatus: value
            ? WORSHIP_ATTENDANCE_STATUS.ABSENT
            : WORSHIP_ATTENDANCE_STATUS.UNKNOWN,
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 특이사항 이벤트
  const onChangeNote = (
    event: ChangeEvent<HTMLTextAreaElement>,
    attendance: WorshipAttendance
  ) => {
    const newNote = event.target.value;

    // 상태 업데이트는 즉시 반영 (UI 반응성 확보)
    const newAttendances = worshipAttendances.map((attd) => {
      if (attd.id === attendance.id) {
        return {
          ...attendance,
          note: newNote,
        };
      } else {
        return attd;
      }
    });
    dispatch(setWorshipAttendances(newAttendances));

    const newWorshipEnrollments = worshipEnrollments.map((enrollment) => {
      if (enrollment.id === attendance.worshipEnrollment.id) {
        return {
          ...enrollment,
          worshipAttendances: enrollment.worshipAttendances.map((attd) => {
            if (attd.id === attendance.id) {
              return {
                ...attd,
                note: newNote,
              };
            } else {
              return attd;
            }
          }),
        } as WorshipEnrollment;
      } else {
        return enrollment;
      }
    });
    dispatch(setWorshipEnrollments(newWorshipEnrollments));

    // 이전 타이머 제거
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // 새 타이머 등록 (300ms 후 서버 저장)
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        await worshipAttendancesApi.editWorshipAttendance(
          {
            churchId,
            worshipId: targetWorship.id,
            sessionId: targetWorshipSession.id,
            attendanceId: attendance.id,
          },
          {
            note: newNote,
          }
        );
      } catch (error) {
        if (error instanceof Error) {
          setToastText(error.message);
        } else {
          setThrownError(new Error(String(error)));
        }
      }
    }, 300);
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

      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={DESTRUCTIVE.LIGHT}
        />
      )}
    </>
  );
};

export default AttendanceInformationTable;
