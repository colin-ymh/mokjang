import React, { useEffect, useState } from 'react';
import {
  DEFAULT_EDUCATION_SESSION,
  EducationSession,
  EducationTerm,
} from '@/models/education/education';
import { EDUCATION } from '@/constants/column/education-column';
import { MainText } from '@/components/atoms/common/text/main-text';
import styled from 'styled-components';
import { GRAY, MAIN } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BLANK_HEADER } from '@/redux/reducers/filter/member-filter-reducer';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { EducationsApi } from '@/api/education/educations.api';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';
import { EducationEnrollmentsApi } from '@/api/education/education-enrollments.api';
import { EducationAttendanceApi } from '@/api/education/education-attendance.api';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';
import {
  fetchEducations,
  setEducationPage,
} from '@/redux/reducers/filter/education-filter-reducer';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import AddEducationSession from '@/components/organisms/education/education-session/add/add-education-session';

// 1. 컬럼별 PX 폭 (마지막 REMARKS만 auto 할 예정)
const getColumnWidth = (id: string) => {
  switch (id) {
    case EDUCATION.NAME:
      return 300;
    default:
      // 비고(REMARKS) 컬럼 등
      return 80;
  }
};

// 5. 본문(TR/TD)
const EducationTableRow = styled.tr`
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  &:hover td {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $isLast?: boolean }>`
  padding: 20px;

  cursor: pointer;

  /* 마지막 컬럼이면 auto, 아니면 px 고정 */
  width: ${({ id, $isLast }) => ($isLast ? 'auto' : `${getColumnWidth(id)}px`)};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    border-left: none;
  }
`;

const EducationNameContainer = styled.div<{ $level: number }>`
  display: flex;
  flex-direction: row;
  padding-left: ${({ $level }) => `${$level * 20}px`};
  align-items: center;
  gap: 10px;
`;

type EducationSessionTableItemProps = {
  educationTerm: EducationTerm;
  educationSession: EducationSession;
};

const EducationSessionTableItem = ({
  educationTerm,
  educationSession,
}: EducationSessionTableItemProps) => {
  const t = useI18n();

  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const { churchId } = useSelector((state: RootState) => state.church);
  const educationApi = new EducationsApi(false);
  const educationTermsApi = new EducationTermsApi(false);
  const educationSessionsApi = new EducationSessionsApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const educationAttendanceApi = new EducationAttendanceApi(false);
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');

  const dispatch = useDispatch<AppDispatch>();

  const { educations, educationTableHeaderItemList } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 교인 상세정보 팝업 On/Off
  const [isEducationInformationShown, setIsEducationInformationShown] =
    useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 실제 표시할 컬럼 ID 배열 + 마지막에 비고란 추가
  const visibleColumns = [
    ...educationTableHeaderItemList.filter((item) => item.isShown),
    BLANK_HEADER,
  ];

  /* educationSession 행에 들어갈 content */
  const getEducationSessionTableContent = (
    id: string,
    session: EducationSession
  ) => {
    // term 컬럼에 맞춰서 작성해야함
    switch (id) {
      case EDUCATION.NAME:
        return (
          <EducationNameContainer $level={2}>
            <MainText>{`${session.session}${t('session')}`}</MainText>
            <MainText>{session.title}</MainText>
          </EducationNameContainer>
        );
      default:
        return null;
    }
  };

  // 목록에서 교육을 선택하여 상세 페이지로 이동
  const onClickEducationSessionItem = async () => {
    try {
      const response = await educationSessionsApi.getEducationSession({
        churchId,
        educationId: educationTerm.educationId,
        educationTermId: educationTerm.id,
        educationSessionId: educationSession.id,
      });

      const attendanceResponse =
        await educationAttendanceApi.getEducationAttendances({
          churchId,
          educationId: educationTerm.educationId,
          educationTermId: educationTerm.id,
          sessionId: educationSession.id,
        });

      const newEducationSession = response.data.data;
      const educationAttendances = attendanceResponse.data.data;

      dispatch(
        setTargetEducationSession({
          ...newEducationSession,
          educationAttendances,
        })
      );
      setIsEducationInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsEducationInformationShown(false);
    dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
  };

  // 기수 삭제하기
  const onClickDelete = async () => {
    try {
      await educationSessionsApi.deleteEducationSession({
        churchId,
        educationId: educationTerm.educationId,
        educationTermId: educationTerm.id,
        educationSessionId: educationSession.id,
      });

      // 초기화 후 다시 로드
      dispatch(setEducationPage(1));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetEducationSession(DEFAULT_EDUCATION_SESSION));
      setIsEducationInformationShown(false);
    }
  };

  const onClickEditOpen = () => {
    dispatch(setTargetEducationSession(targetEducationSession));
    setIsEditShown(true);
  };

  const onClickEditClose = async () => {
    setIsEditShown(false);
    const response = await educationSessionsApi.getEducationSession({
      churchId,
      educationId: educationTerm.educationId,
      educationTermId: educationTerm.id,
      educationSessionId: educationSession.id,
    });
    const newEducationSession = response.data.data;
    dispatch(
      setTargetEducationSession({
        ...newEducationSession,
        educationAttendances: targetEducationSession.educationAttendances,
      })
    );
  };

  const onClickEditDone = async () => {
    try {
      await educationSessionsApi
        .editEducationSession(
          {
            churchId,
            educationId: educationTerm.educationId,
            educationTermId: educationTerm.id,
            educationSessionId: educationSession.id,
          },
          {
            title: targetEducationSession.title || undefined,
            startDate: targetEducationSession.startDate || undefined,
            endDate: targetEducationSession.endDate || undefined,
            inChargeId: targetEducationSession.inChargeId || undefined,
            content: targetEducationSession.content || undefined,
          }
        )
        .then((response) => {
          const newEducationSession = response.data.data;
          dispatch(
            setTargetEducationSession({
              ...newEducationSession,
              educationAttendances: targetEducationSession.educationAttendances,
            })
          );
          dispatch(fetchEducations());
          setIsEditShown(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetEducationSession]);

  // useEffect(() => {
  //   if (!getIsWellFormedTitle(targetEducationSession.name)) {
  //     setIsSaveEnabled(false);
  //     return;
  //   }
  //
  //   setIsSaveEnabled(true);
  // }, [targetEducationSession]);
  return (
    <>
      <EducationTableRow onClick={onClickEducationSessionItem}>
        {visibleColumns.map((item, index) => (
          <TableData
            key={`${educationSession.id}-${item.id}`}
            id={item.id}
            $isLast={index === visibleColumns.length - 1}
          >
            {getEducationSessionTableContent(item.id, educationSession)}
          </TableData>
        ))}
      </EducationTableRow>

      {/* 교육 상세정보 팝업*/}
      <WrappedPagePopup
        isShow={isEducationInformationShown}
        onClickClose={onClickClose}
        headerTitle={`${educationTerm?.educationName}-${educationTerm.term}-${educationSession.title}`}
        // headerDescription={targetEducationSession?.descriptio}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditOpen}
        onClickCancel={onClickConfirmOpen}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationTitle')}
            body={t_popup('deleteEducationBody')}
            buttonNum={2}
            isShow={isPopupShown}
            onClickLeftButton={onClickConfirmClose}
            onClickRightButton={() => {
              onClickDelete();
              onClickConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EducationSessionInformation />
        </>
      </WrappedPagePopup>

      {/* 교육 수정 팝업*/}
      <WrappedPagePopup
        isShow={isEditShown}
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        onClickDone={onClickEditDone}
        headerTitle={t_title('editEducation')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddEducationSession />
      </WrappedPagePopup>
    </>
  );
};

export default EducationSessionTableItem;
