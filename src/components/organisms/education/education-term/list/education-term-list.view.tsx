import styled from 'styled-components';

import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { BLACK, MAIN } from '@/constants/styles/color';
import CancelIcon from '../../../../../../public/svg/cancel.svg';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import EducationTermRow from '@/components/molecules/education/education-term/education-term-row';
import EducationTermTable, {
  EducationTermTableProps,
} from '@/components/molecules/education/education-term/education-term-table';
import EducationTermInformation from '@/components/organisms/education/education-term/information/education-term-information';
import AddEducationTerm from '@/components/organisms/education/education-term/add/add-education-term';
import AddEducationSession from '@/components/organisms/education/education-session/add/add-education-session';
import EducationSessionInformation from '@/components/organisms/education/education-session/information/education-session-information';
import { EducationTerm } from '@/models/education/education';

const EducationTermListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type EducationTermListViewProps = {
  list: EducationTermTableProps;
  information: {
    isLoading: boolean;
    // 기수
    term: {
      isTermSaveEnabled: boolean;
      isEducationTermInformationShown: boolean;
      isEditTermShown: boolean;
      isTermPopupShown: boolean;
      onClickCloseTerm: () => void;
      onClickDeleteTerm: () => void;
      onClickDeleteTermConfirmOpen: () => void;
      onClickDeleteTermConfirmClose: () => void;
      onClickEditTermDone: () => void;
      onClickEditTermOpen: () => void;
      onClickEditTermClose: () => void;
    };
    // 회차
    session: {
      isSessionSaveEnabled: boolean;
      isAddEducationSessionShown: boolean;
      isEducationSessionInformationShown: boolean;
      isEditSessionShown: boolean;
      isSessionPopupShown: boolean;
      onClickEducationSessionItem: (
        educationTermId: string,
        educationSessionId: string
      ) => void;
      onClickOpenAddEducationSession: (educationTerm?: EducationTerm) => void;
      onClickCloseAddEducationSession: () => void;
      onClickAddSessionsDone: () => void;
      onClickCloseSession: () => void;
      onClickDeleteSession: () => void;
      onClickDeleteSessionConfirmOpen: () => void;
      onClickDeleteSessionConfirmClose: () => void;
      onClickEditSessionDone: () => void;
      onClickEditSessionOpen: () => void;
      onClickEditSessionClose: () => void;
    };
  };
};

const EducationTermListView = (props: EducationTermListViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const { isLoading } = props.information;
  const {
    isTermSaveEnabled,
    isEducationTermInformationShown,
    isEditTermShown,
    isTermPopupShown,
    onClickCloseTerm,
    onClickDeleteTerm,
    onClickDeleteTermConfirmOpen,
    onClickDeleteTermConfirmClose,
    onClickEditTermDone,
    onClickEditTermOpen,
    onClickEditTermClose,
  } = props.information.term;
  const {
    isSessionSaveEnabled,
    isAddEducationSessionShown,
    isEducationSessionInformationShown,
    isEditSessionShown,
    isSessionPopupShown,
    onClickEducationSessionItem,
    onClickOpenAddEducationSession,
    onClickCloseAddEducationSession,
    onClickAddSessionsDone,
    onClickCloseSession,
    onClickDeleteSession,
    onClickDeleteSessionConfirmOpen,
    onClickDeleteSessionConfirmClose,
    onClickEditSessionDone,
    onClickEditSessionOpen,
    onClickEditSessionClose,
  } = props.information.session;

  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  return (
    <EducationTermListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <EducationTermItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <EducationTermRow />
        <EducationTermTable {...props.list} />
      </DesktopView>
      {/* 기수 상세정보 팝업*/}
      <SlidePopup
        isShow={isEducationTermInformationShown}
        onClickClose={onClickCloseTerm}
        isFooterShown={false}
        headerTitle={`${targetEducation.name} ${targetEducationTerm?.term}기`}
        headerRight={
          <ButtonRow>
            <KebabDropdown
              items={[
                {
                  value: 'delete',
                  title: t_button('delete'),
                  onClick: onClickDeleteTermConfirmOpen,
                },
                {
                  value: 'edit',
                  title: t_button('edit'),
                  onClick: onClickEditTermOpen,
                },
              ]}
              width={150}
            />
            <ButtonContainer onClick={onClickCloseTerm}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <>
          {/* 기수 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationTermTitle')}
            body={t_popup('deleteEducationTermBody')}
            buttonNum={2}
            isShow={isTermPopupShown}
            onClickLeftButton={onClickDeleteTermConfirmClose}
            onClickRightButton={() => {
              onClickDeleteTerm();
              onClickDeleteTermConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EducationTermInformation
            onClickAddSession={onClickOpenAddEducationSession}
            onClickEducationSessionItem={onClickEducationSessionItem}
          />
        </>
      </SlidePopup>
      {/* 기수 수정 팝업*/}
      <SlidePopup
        isShow={isEditTermShown}
        onClickClose={onClickEditTermClose}
        onClickDone={onClickEditTermDone}
        doneText={t_button('edit')}
        headerTitle={t_title('editEducationTerm')}
        doneBackgroundColor={isTermSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isTermSaveEnabled}
      >
        <AddEducationTerm />
      </SlidePopup>
      {/* ----------- 회차 ----------*/}
      {/* 회차 추가 팝업*/}
      <SlidePopup
        isShow={isAddEducationSessionShown}
        onClickClose={onClickCloseAddEducationSession}
        onClickDone={onClickAddSessionsDone}
        doneText={t_button('save')}
        headerTitle={t_title('addEducationSession')}
        doneBackgroundColor={isSessionSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSessionSaveEnabled}
      >
        <AddEducationSession />
      </SlidePopup>
      {/* 회차 상세정보 팝업*/}
      <SlidePopup
        isShow={isEducationSessionInformationShown}
        onClickClose={onClickCloseSession}
        isFooterShown={false}
        headerTitle={`${targetEducationSession.session}${t('session')} ${targetEducationSession.title}`}
        headerRight={
          <ButtonRow>
            <KebabDropdown
              items={[
                {
                  value: 'delete',
                  title: t_button('delete'),
                  onClick: onClickDeleteSessionConfirmOpen,
                },
                {
                  value: 'edit',
                  title: t_button('edit'),
                  onClick: onClickEditSessionOpen,
                },
              ]}
              width={150}
            />
            <ButtonContainer onClick={onClickCloseSession}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <>
          {/* 회차 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationSessionTitle')}
            body={t_popup('deleteEducationSessionBody')}
            buttonNum={2}
            isShow={isSessionPopupShown}
            onClickLeftButton={onClickDeleteSessionConfirmClose}
            onClickRightButton={() => {
              onClickDeleteSession();
              onClickDeleteSessionConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <EducationSessionInformation />
        </>
      </SlidePopup>
      {/* 회차 수정 팝업*/}
      <SlidePopup
        isShow={isEditSessionShown}
        onClickClose={onClickEditSessionClose}
        onClickDone={onClickEditSessionDone}
        doneText={t_button('edit')}
        headerTitle={t_title('editEducationSession')}
        doneBackgroundColor={isSessionSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSessionSaveEnabled}
      >
        <AddEducationSession />
      </SlidePopup>
      {/* ----------- 회차 ----------*/}
      <Loading isShow={isLoading} />
    </EducationTermListContainer>
  );
};

export default EducationTermListView;
