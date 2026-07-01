import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useScopedI18n } from '../../../../../locales/client';
import { MAIN } from '@mokjang/constants';
import WrappedPagePopup from '../../../atoms/common/popup/wrapped-page-popup';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import EducationInformation from '../../../organisms/education/education/information/education-information';
import AddEducation from '../../../organisms/education/education/add/add-education';

export type EducationInformationModalsProps = {
  isEducationInformationShown: boolean;
  onClickEducationInformationClose: () => void;
  onClickEditEducationOpen: () => void;
  onClickDeleteEducationConfirmOpen: () => void;

  isEducationDeletePopupShown: boolean;
  onClickDeleteEducationConfirmClose: () => void;
  onClickDeleteEducation: () => void;

  isEducationEditShown: boolean;
  onClickEditEducationClose: () => void;
  onClickEditEducationDone: () => void;
  isEducationSaveEnabled: boolean;
};

// education-table 컨테이너에서 교육(Education) 상세/수정 모달 묶음을 분리한 컴포넌트.
// 상태/핸들러는 컨테이너가 소유하고, i18n·targetEducation은 여기서 직접 구독한다.
const EducationInformationModals = ({
  isEducationInformationShown,
  onClickEducationInformationClose,
  onClickEditEducationOpen,
  onClickDeleteEducationConfirmOpen,
  isEducationDeletePopupShown,
  onClickDeleteEducationConfirmClose,
  onClickDeleteEducation,
  isEducationEditShown,
  onClickEditEducationClose,
  onClickEditEducationDone,
  isEducationSaveEnabled,
}: EducationInformationModalsProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  return (
    <>
      {/* 교육 상세정보 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationInformationShown}
        onClickClose={onClickEducationInformationClose}
        headerTitle={targetEducation?.name}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditEducationOpen}
        onClickCancel={onClickDeleteEducationConfirmOpen}
        widthPercentage={45}
      >
        {(scrollRef) => (
          <>
            {/* 삭제 확인 팝업 */}
            <ConfirmPopup
              title={t_popup('deleteEducationTitle')}
              body={t_popup('deleteEducationBody')}
              buttonNum={2}
              isShow={isEducationDeletePopupShown}
              onClickLeftButton={onClickDeleteEducationConfirmClose}
              onClickRightButton={() => {
                onClickDeleteEducation();
                onClickDeleteEducationConfirmClose();
              }}
              leftButtonText={t_button('cancel')}
              rightButtonText={t_button('delete')}
            />
            <EducationInformation scrollRef={scrollRef} />
          </>
        )}
      </WrappedPagePopup>

      {/* 교육 수정 팝업*/}
      <WrappedPagePopup
        keyboardDisabled={true}
        isShow={isEducationEditShown}
        onClickClose={onClickEditEducationClose}
        onClickCancel={onClickEditEducationClose}
        onClickDone={onClickEditEducationDone}
        doneBackgroundColor={isEducationSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isEducationSaveEnabled}
        widthPercentage={45}
        zIndex={1100}
        closeText={t_button('backToEducation')}
        blur={false}
      >
        <AddEducation isEdit />
      </WrappedPagePopup>
    </>
  );
};

export default EducationInformationModals;
