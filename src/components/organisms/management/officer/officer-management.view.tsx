import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import OfficerList from '@/components/molecules/management/officer/list/officer-list';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY, WHITE } from '@/constants/styles/color';
import { Officer } from '@/models/management/management';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import OfficerMember from '@/components/molecules/management/officer/member/officer-member';
import Button from '@/components/atoms/common/button/button';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import BorderInput from '@/components/atoms/common/input/border-input';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import LabelInput from '@/components/atoms/common/input/label-input';
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import ConfirmPopup from '@/components/atoms/common/popup/confirm-popup';

const OfficerManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const OfficerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.LIGHT};
  width: 400px;
  flex-shrink: 0;
`;

const AddContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const OfficerInformationContainer = styled.div<{ $isOfficer: boolean }>`
  display: ${({ $isOfficer }) => ($isOfficer ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
`;

const OfficerInformationHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  padding: 20px;
`;

const EditContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

type OfficerManagementViewProps = {
  newOfficerName: string;
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
  onChangeNewOfficerName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSaveNewOfficer: () => void;
  selectedOfficer: Officer;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
  isToastShown: boolean;
  toastText: string;
  toastColor: string;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const OfficerManagementView = ({
  newOfficerName,
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
  onChangeNewOfficerName,
  onClickSaveNewOfficer,
  selectedOfficer,
  setSelectedOfficer,
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
        <OfficerListContainer>
          {/* 타이틀 */}
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {t('officerList')}
          </MainText>
          {/* 새 그룹 추가 창*/}
          <AddContainer>
            <BorderInput
              value={newOfficerName}
              onChange={onChangeNewOfficerName}
              borderColor={GRAY.SEMI_LIGHT}
            />
            <Button
              width={80}
              text={t('button.add')}
              onClick={onClickSaveNewOfficer}
              borderColor={GRAY.SEMI_LIGHT}
              backgroundColor={WHITE}
              color={GRAY.DARK}
            />
          </AddContainer>
          {/* 그룹 목록 */}
          <OfficerList
            selectedOfficerId={selectedOfficer.id}
            setSelectedOfficer={setSelectedOfficer}
          />
        </OfficerListContainer>
        {/* 그룹원 목록 */}
        <OfficerInformationContainer $isOfficer={!!selectedOfficer.id}>
          {/* 헤더 */}
          <OfficerInformationHeader>
            <MainText size={SIZE.LARGE} fontWeight={600}>
              {selectedOfficer.name}
            </MainText>
            <KebabDropdown
              items={[
                {
                  value: 'delete',
                  title: t_button('delete'),
                  onClick: () => onClickDeleteOpen(),
                },
                {
                  value: 'edit',
                  title: t_button('edit'),
                  onClick: () => onClickEditOpen(),
                },
              ]}
              width={150}
            />
          </OfficerInformationHeader>
          {/* 컨텐츠 */}
          {selectedOfficer.id && <OfficerMember officer={selectedOfficer} />}
        </OfficerInformationContainer>
      </OfficerManagementContainer>
      {/* 토스트 팝업 */}
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={toastColor}
        />
      )}
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
