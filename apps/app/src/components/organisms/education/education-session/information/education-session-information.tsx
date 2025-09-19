import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { EducationSessionsApi } from '../../../../../api/education/education-sessions.api';
import { RefObject, useEffect, useState } from 'react';
import { EducationAttendance } from '@mokjang/models';
import { setTargetEducationSession } from '../../../../../redux/reducers/target/target-education-session-reducer';
import EducationSessionInformationView from './education-session-information.view';

import { STATUS, TASK_STATUS } from '@mokjang/constants';
import { EducationAttendanceApi } from '../../../../../api/education/education-attendance.api';
import { EDUCATION_SESSION_CONTENT_ID } from '../../../../../constants/layout/content';
import { CustomError } from '../../../../../api/error/error';

type EducationSessionInformationProps = {
  scrollRef: RefObject<HTMLDivElement>;
  onChangeStatus: (status: TASK_STATUS) => void;
};

const EducationSessionInformation = ({
  scrollRef,
  onChangeStatus,
}: EducationSessionInformationProps) => {
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const { churchId } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);

  const [headerBar, setHeaderBar] = useState<EDUCATION_SESSION_CONTENT_ID>(
    EDUCATION_SESSION_CONTENT_ID.CONTENT
  );

  const TAKE = 10; // 한번에 가져올 개수(무한스크롤 페이지 사이즈)

  const [page, setPage] = useState<number>(1);

  // 무한스크롤 제어용 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onChangeHeaderBar = (headerBar: EDUCATION_SESSION_CONTENT_ID) => {
    setHeaderBar(headerBar);
  };

  const onClickAllAttended = () => {
    try {
      const newEducationSession = {
        ...targetEducationSession,
        educationAttendances: targetEducationSession.educationAttendances.map(
          (attendance) => {
            return {
              ...attendance,
              status: STATUS.PRESENT,
            } as EducationAttendance;
          }
        ),
      };

      dispatch(setTargetEducationSession(newEducationSession));

      educationAttendanceApi.patchAllAttended({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        sessionId: targetEducationSession.id,
      });
    } catch (error) {
      setThrownError(error as CustomError);
    }
  };

  // -------- attendance ---------
  const fetchAttendances = async () => {
    // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await educationAttendanceApi.getEducationAttendances({
        churchId,
        educationId: targetEducationTerm.educationId,
        educationTermId: targetEducationTerm.id,
        sessionId: targetEducationSession.id,
        page,
        take: TAKE,
      });

      const newAttendances: EducationAttendance[] = response.data.data;

      // 불러온 데이터가 없으면 더 이상 페이지가 없다고 판단
      if (!newAttendances || newAttendances.length === 0) {
        setHasMore(false);
        return;
      }

      const existingAttendances =
        targetEducationSession.educationAttendances || [];

      // 중복 ID 제거
      const existingIds = new Set(existingAttendances.map((e) => e.id));
      const filteredNewAttendances = newAttendances.filter(
        (e) => !existingIds.has(e.id)
      );

      if (filteredNewAttendances.length === 0) {
        // 가져온 데이터가 모두 중복이면, 더 이상 가져올 게 없다고 판단
        setHasMore(false);
        return;
      }

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          educationAttendances: [
            ...existingAttendances,
            ...filteredNewAttendances,
          ],
        })
      );

      // 이번 페이지에서 TAKE보다 적게 가져왔으면 다음 페이지는 없음
      if (filteredNewAttendances.length < TAKE) {
        setHasMore(false);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 16; // px
    const onScroll = () => {
      // 스크롤이 최하단에 도달했는지 확인
      if (isLoading || !hasMore) return;
      // 스크롤 가능한 상태(내용 높이가 컨테이너보다 큰가)
      const isScrollable = el.scrollHeight > el.clientHeight + 1;
      if (!isScrollable) return;

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
        setPage((prev) => prev + 1);
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, [scrollRef, isLoading, hasMore]);

  useEffect(() => {
    fetchAttendances();
  }, [page]);

  const props = {
    headerBar,
    onChangeHeaderBar,
    onChangeStatus,
    onClickAllAttended,
  };
  return (
    <>
      <EducationSessionInformationView {...props} />
    </>
  );
};

export default EducationSessionInformation;
