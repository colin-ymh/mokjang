import React, { Dispatch, SetStateAction } from 'react';
import { Church } from '@/models/church/church';
import ChurchInformation from '@/components/molecules/management/church/church-information';
import styled from 'styled-components';
import Button from '@/components/atoms/common/button/button';
import { GRAY, WHITE } from '@/constants/styles/color';
import { useI18n } from '../../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import EditChurchInformation from '@/components/molecules/management/church/edit-church-information';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  border-right: 1px solid ${GRAY.EXTRA_LIGHT};
  padding: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

type ChurchManagementViewProps = {
  targetChurch: Church;
  setTargetChurch: Dispatch<SetStateAction<Church>>;
  isEditShown: boolean;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onClickEditSave: () => void;
};

const ChurchManagementView = ({
  targetChurch,
  setTargetChurch,
  isEditShown,
  onClickEditOpen,
  onClickEditClose,
  onClickEditSave,
}: ChurchManagementViewProps) => {
  const t = useI18n();
  return (
    <>
      <InformationContainer>
        <HeaderContainer>
          <Button
            width={150}
            height={30}
            text={t('button.editChurch')}
            onClick={onClickEditOpen}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={WHITE}
            color={GRAY.DARK}
          />
        </HeaderContainer>
        <ChurchInformation />
        <CustomPopup
          isShow={isEditShown}
          onClickCancel={onClickEditClose}
          onClickDone={onClickEditSave}
          width={500}
          height={700}
        >
          <EditChurchInformation
            targetChurch={targetChurch}
            setTargetChurch={setTargetChurch}
          />
        </CustomPopup>
      </InformationContainer>
    </>
  );
};

export default ChurchManagementView;
