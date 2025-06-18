import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BLANK, HEADER_BAR } from '@/constants/constant';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';
import {
  fetchWorshipEnrollments,
  setWorshipEnrollments,
} from '@/redux/reducers/filter/worship-enrollment-filter-reducer';
import {
  DEFAULT_WORSHIP_SESSION,
  WorshipEnrollment,
} from '@/models/worship/worship';
import { setTargetWorshipSession } from '@/redux/reducers/target/target-worship-session-reducer';
import AttendanceListView from '@/components/organisms/attendance/list/attendance-list.view';

type AttendanceListProps = {
  headerType?: HEADER_BAR;
};

const AttendanceList = ({
  headerType = HEADER_BAR.ALL,
}: AttendanceListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    worshipEnrollments,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
  } = useSelector((state: RootState) => state.worshipEnrollmentFilter);
  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 상세정보 팝업 On/Off
  const [isAttendanceInformationShown, setIsAttendanceInformationShown] =
    useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 무한 스크롤로 데이터 추가 로드
  const loadWorshipEnrollments = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchWorshipEnrollments({
          churchId,
          currentPage: page + 1,
        })
      );
      if (fetchWorshipEnrollments.fulfilled.match(result)) {
        const newWorshipEnrollments: WorshipEnrollment[] = result.payload;
        if (newWorshipEnrollments.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            worshipEnrollments.map((worshipEnrollment) => worshipEnrollment.id)
          );
          const filteredNewAttendances = newWorshipEnrollments.filter(
            (enrollment) => !existingIds.has(enrollment.id)
          );
          dispatch(
            setWorshipEnrollments([
              ...worshipEnrollments,
              ...filteredNewAttendances,
            ])
          );
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 출석부를 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialEnrollments = async () => {
      try {
        const result = await dispatch(
          fetchWorshipEnrollments({
            churchId,
            currentPage: 1,
          })
        );
        if (fetchWorshipEnrollments.fulfilled.match(result)) {
          dispatch(setWorshipEnrollments(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialEnrollments();
  }, [
    churchId,
    worshipEnrollmentFilter,
    worshipEnrollmentOrderBy,
    worshipEnrollmentOrderDirection,
    headerType === HEADER_BAR.MY,
  ]);

  const onClickEditDone = async () => {
    try {
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 목록에서 회차를 선택하여 출석 페이지로 이동
  const onClickWorshipEnrollment = async (enrollmentId: string) => {
    try {
      // const response = await tasksApi.getAttendance({
      //   churchId,
      //   taskId,
      // });
      // const task = response.data.data;
      //
      // dispatch(setTargetWorshipSession(task));
      setIsAttendanceInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsAttendanceInformationShown(false);
    dispatch(setTargetWorshipSession(DEFAULT_WORSHIP_SESSION));
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    // const prevEnrollment = worshipEnrollments.find((enrollment) => enrollment.id === targetWorshipSession.id);
    // if (prevEnrollment) {
    //   dispatch(setTargetWorshipSession(prevEnrollment));
    // }
    setIsEditShown(false);
    setTimeout(() => {
      setIsAttendanceInformationShown(true);
    }, 500);
  };

  // 수정 페이지 열기
  const onClickEditOpen = () => {
    setIsAttendanceInformationShown(false);
    setTimeout(() => {
      setIsEditShown(true);
    }, 500);
  };

  useEffect(() => {
    if (toastText) {
      setIsToastShown(true);
    }
  }, [toastText]);

  const props = {
    list: {
      onClickWorshipEnrollment,
      loadWorshipEnrollments,
    },
    information: {
      isAttendanceInformationShown,
      isLoading,
      onClickClose,
    },
  };

  return (
    <>
      <AttendanceListView {...props} />
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

export default AttendanceList;
