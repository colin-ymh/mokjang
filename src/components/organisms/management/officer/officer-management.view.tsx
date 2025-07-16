import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY, WHITE } from '@/constants/styles/color';
import { Officer } from '@/models/management/management';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import OfficerMember from '@/components/molecules/management/officer/member/officer-member';
import Button from '@/components/atoms/common/button/button';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import LabelInput from '@/components/atoms/common/input/label-input';
import ConfirmPopup from '@/components/atoms/common/popup/confirm-popup';

import Plus from '../../../../../public/svg/plus.svg';
import Setting from '../../../../../public/svg/setting.svg';
import OfficerSideBar from '@/components/molecules/management/officer/list/officer-side-bar';

const OfficerManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const OfficerInformationContainer = styled.div<{ $isOfficer: boolean }>`
  display: ${({ $isOfficer }) => ($isOfficer ? 'flex' : 'none')};
  flex-direction: column;
`;

const OfficerInformationHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const EditContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

const PlusIcon = styled(Plus)`
  width: 14px;
  height: 14px;
  stroke: ${WHITE};
  stroke-width: 0.1px;
`;

const SettingIcon = styled(Setting)`
  width: 16px;
  height: 16px;
  stroke: ${GRAY.LIGHT};
  stroke-width: 0.1px;
`;

type OfficerManagementViewProps = {
  isEditShown: boolean;
  isDeleteShown: boolean;
  editName: string;
  onChangeEditOfficerName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickDeleteOpen: () => void;
  onClickDeleteClose: () => void;
  onClickDelete: () => void;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onClickSaveEdit: () => void;
  selectedOfficer: Officer;
  onClickOfficer: (id: string) => void;
  isToastShown: boolean;
  toastText: string;
  toastColor: string;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const OfficerManagementView = ({
  isEditShown,
  isDeleteShown,
  editName,
  onChangeEditOfficerName,
  onClickDeleteOpen,
  onClickDeleteClose,
  onClickDelete,
  onClickEditOpen,
  onClickEditClose,
  onClickSaveEdit,
  selectedOfficer,
  onClickOfficer,
  isToastShown,
  toastText,
  toastColor,
  setIsToastShown,
}: OfficerManagementViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  return (
    <>
      <OfficerManagementContainer>
        {/* 그룹 목록 */}
        <OfficerSideBar
          selectedOfficer={selectedOfficer}
          onClickOfficer={onClickOfficer}
        />
        {/* 그룹원 목록 */}
        <OfficerInformationContainer $isOfficer={!!selectedOfficer.id}>
          {/* 헤더 */}
          <OfficerInformationHeader>
            <MainText size={SIZE.LARGE} fontWeight={600}>
              {selectedOfficer.name}
            </MainText>
            <ButtonContainer>
              <Button
                text={t('button.edit')}
                onClick={onClickEditOpen}
                color={GRAY.SEMI_DARK}
                width={'auto'}
                height={30}
                backgroundColor={'transparent'}
                icon={<SettingIcon />}
              />
              <Button
                text={t('button.addMember')}
                onClick={() => {}}
                color={WHITE}
                width={'auto'}
                height={30}
                icon={<PlusIcon />}
              />
            </ButtonContainer>
          </OfficerInformationHeader>
          {/* 컨텐츠 */}
          {selectedOfficer.id && <OfficerMember officer={selectedOfficer} />}
        </OfficerInformationContainer>
      </OfficerManagementContainer>

      {/* 그룹명 수정 팝업 */}
      <CustomPopup
        isShow={isEditShown}
        onClickCancel={onClickEditClose}
        onClickDone={onClickSaveEdit}
        width={400}
        height={200}
        headerTitle={t('title.editOfficerName')}
      >
        <EditContainer>
          <LabelInput
            label={t('officerName')}
            value={editName}
            onChange={onChangeEditOfficerName}
            placeholder={t('placeholder.officerName')}
          />
        </EditContainer>
      </CustomPopup>
      {/* 그룹 삭제 팝업 */}
      <ConfirmPopup
        isShow={isDeleteShown}
        onClickLeftButton={onClickDeleteClose}
        onClickRightButton={onClickDelete}
        title={t_popup('deleteOfficerTitle')}
        body={t_popup('deleteOfficerBody')}
        buttonNum={2}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
      />
    </>
  );
};

export default OfficerManagementView;
