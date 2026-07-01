import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '../../../../redux/store';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { LOCALE, MAIN, TASK_STATUS } from '@mokjang/constants';
import { getTranslatedTerm } from '@mokjang/utils';
import WrappedPagePopup from '../../../atoms/common/popup/wrapped-page-popup';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import EducationSessionInformation from '../../../organisms/education/education-session/information/education-session-information';
import AddEducationSession from '../../../organisms/education/education-session/add/add-education-session';

export type EducationSessionModalsProps = {
  isEducationSessionInformationShown: boolean;
  onClickEducationSessionInformationClose: () => void;
  onClickEditEducationSessionOpen: () => void;
  onClickDeleteEducationSessionConfirmOpen: () => void;
  onChangeSessionStatus: (status: TASK_STATUS) => void;

  isEducationSessionDeletePopupShown: boolean;
  onClickDeleteEducationSessionConfirmClose: () => void;
  onClickDeleteEducationSession: () => void;

  isEducationSessionEditShown: boolean;
  onClickEditEducationSessionClose: () => void;
  onClickEditEducationSessionDone: () => void;
  isEducationSessionSaveEnabled: boolean;
};

// education-table 컨테이너에서 교육회차(EducationSession) 상세/수정 모달 묶음을 분리.
const EducationSessionModals = ({
  isEducationSessionInformationShown,
  onClickEducationSessionInformationClose,
  onClickEditEducationSessionOpen,
  onClickDeleteEducationSessionConfirmOpen,
  onChangeSessionStatus,
  isEducationSessionDeletePopupShown,
  onClickDeleteEducationSessionConfirmClose,
  onClickDeleteEducationSession,
  isEducationSessionEditShown,
  onClickEditEducationSessionClose,
  onClickEditEducationSessionDone,
  isEducationSessionSaveEnabled,
}: EducationSessionModalsProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  return (
    <>
      {/* 교육회차 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationSessionInformationShown}
        onClickClose={onClickEducationSessionInformationClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)} - ${targetEducationSession.session}${t('session')} ${targetEducationSession.title}`}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationSessionOpen}
        onClickCancel={onClickDeleteEducationSessionConfirmOpen}
        stageTwoTop={40}
        stageThreeTop={250}
        status={targetEducationSession.status}
        onChangeStatus={onChangeSessionStatus}
        inCharge={targetEducationSession.inCharge}
        startDate={targetEducationSession.startDate}
        endDate={targetEducationSession.endDate}
        widthPercentage={45}
      >
        {(scrollRef) => (
          <>
            {/* 삭제 확인 팝업 */}
            <ConfirmPopup
              title={t_popup('deleteEducationSessionTitle')}
              body={t_popup('deleteEducationSessionBody')}
              buttonNum={2}
              isShow={isEducationSessionDeletePopupShown}
              onClickLeftButton={onClickDeleteEducationSessionConfirmClose}
              onClickRightButton={() => {
                onClickDeleteEducationSession();
                onClickDeleteEducationSessionConfirmClose();
              }}
              leftButtonText={t_button('cancel')}
              rightButtonText={t_button('delete')}
            />
            <EducationSessionInformation
              scrollRef={scrollRef}
              onChangeStatus={onChangeSessionStatus}
            />
          </>
        )}
      </WrappedPagePopup>

      {/* 교육회차 수정 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationSessionEditShown}
        onClickClose={onClickEditEducationSessionClose}
        onClickCancel={onClickEditEducationSessionClose}
        onClickDone={onClickEditEducationSessionDone}
        headerTitle={t_title('editEducationSession')}
        doneBackgroundColor={
          isEducationSessionSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT
        }
        doneDisabled={!isEducationSessionSaveEnabled}
        closeText={t_button('backToEducationSession')}
        widthPercentage={45}
      >
        <AddEducationSession />
      </WrappedPagePopup>
    </>
  );
};

export default EducationSessionModals;
