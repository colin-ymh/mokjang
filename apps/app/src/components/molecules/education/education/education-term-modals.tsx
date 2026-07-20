import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '../../../../redux/store';
import { useScopedI18n } from '../../../../../locales/client';
import { LOCALE, MAIN, TASK_STATUS } from '@mokjang/constants';
import { getTranslatedTerm } from '@mokjang/utils';
import WrappedPagePopup from '../../../atoms/common/popup/wrapped-page-popup';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import EducationTermInformation from '../../../organisms/education/education-term/information/education-term-information';
import AddEducationTerm from '../../../organisms/education/education-term/add/add-education-term';

export type EducationTermModalsProps = {
  isEducationTermInformationShown: boolean;
  onClickEducationTermInformationClose: () => void;
  onClickEditEducationTermOpen: () => void;
  onClickDeleteEducationTermConfirmOpen: () => void;
  onChangeTermStatus: (status: TASK_STATUS) => void;

  isEducationTermDeletePopupShown: boolean;
  onClickDeleteEducationTermConfirmClose: () => void;
  onClickDeleteEducationTerm: () => void;

  isEducationTermEditShown: boolean;
  onClickEditEducationTermClose: () => void;
  onClickEditEducationTermDone: () => void;
  isEducationTermSaveEnabled: boolean;
};

// education-table 컨테이너에서 교육기수(EducationTerm) 상세/수정 모달 묶음을 분리.
const EducationTermModals = ({
  isEducationTermInformationShown,
  onClickEducationTermInformationClose,
  onClickEditEducationTermOpen,
  onClickDeleteEducationTermConfirmOpen,
  onChangeTermStatus,
  isEducationTermDeletePopupShown,
  onClickDeleteEducationTermConfirmClose,
  onClickDeleteEducationTerm,
  isEducationTermEditShown,
  onClickEditEducationTermClose,
  onClickEditEducationTermDone,
  isEducationTermSaveEnabled,
}: EducationTermModalsProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  return (
    <>
      {/* 교육기수 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationTermInformationShown}
        onClickClose={onClickEducationTermInformationClose}
        headerTitle={`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)}`}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationTermOpen}
        onClickCancel={onClickDeleteEducationTermConfirmOpen}
        stageTwoTop={40}
        stageThreeTop={250}
        status={targetEducationTerm.status}
        onChangeStatus={onChangeTermStatus}
        inCharge={targetEducationTerm.inCharge}
        startDate={targetEducationTerm.startDate}
        endDate={targetEducationTerm.endDate}
        widthPercentage={45}
      >
        {(scrollRef) => (
          <>
            {/* 삭제 확인 팝업 */}
            <ConfirmPopup
              title={t_popup('deleteEducationTermTitle')}
              body={t_popup('deleteEducationTermBody')}
              buttonNum={2}
              isShow={isEducationTermDeletePopupShown}
              onClickLeftButton={onClickDeleteEducationTermConfirmClose}
              onClickRightButton={() => {
                onClickDeleteEducationTerm();
                onClickDeleteEducationTermConfirmClose();
              }}
              leftButtonText={t_button('cancel')}
              rightButtonText={t_button('delete')}
            />
            <EducationTermInformation
              scrollRef={scrollRef}
              onChangeStatus={onChangeTermStatus}
            />
          </>
        )}
      </WrappedPagePopup>

      {/* 교육기수 수정 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationTermEditShown}
        onClickClose={onClickEditEducationTermClose}
        onClickCancel={onClickEditEducationTermClose}
        onClickDone={onClickEditEducationTermDone}
        headerTitle={t_title('editEducationTerm')}
        doneBackgroundColor={
          isEducationTermSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT
        }
        doneDisabled={!isEducationTermSaveEnabled}
        closeText={t_button('backToEducationTerm')}
        widthPercentage={45}
      >
        <AddEducationTerm isEdit />
      </WrappedPagePopup>
    </>
  );
};

export default EducationTermModals;
