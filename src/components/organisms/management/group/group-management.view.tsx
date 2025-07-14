import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import GroupList from '@/components/molecules/management/group/list/group-list';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY, WHITE } from '@/constants/styles/color';
import { Group } from '@/models/management/management';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import GroupMember from '@/components/molecules/management/group/member/group-member';
import Button from '@/components/atoms/common/button/button';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import BorderInput from '@/components/atoms/common/input/border-input';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import LabelInput from '@/components/atoms/common/input/label-input';
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import ConfirmPopup from '@/components/atoms/common/popup/confirm-popup';

const GroupManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const GroupListContainer = styled.div`
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

const GroupInformationContainer = styled.div<{ $isGroup: boolean }>`
  display: ${({ $isGroup }) => ($isGroup ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
`;

const GroupInformationHeader = styled.div`
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

type GroupManagementViewProps = {
  newGroupName: string;
  isEditShown: boolean;
  isDeleteShown: boolean;
  editName: string;
  onChangeEditGroupName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickDeleteOpen: () => void;
  onClickDeleteClose: () => void;
  onClickDelete: () => void;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onClickSaveEdit: () => void;
  onChangeNewGroupName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickSaveNewGroup: () => void;
  selectedGroup: Group;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  isToastShown: boolean;
  toastText: string;
  toastColor: string;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const GroupManagementView = ({
  newGroupName,
  isEditShown,
  isDeleteShown,
  editName,
  onChangeEditGroupName,
  onClickDeleteOpen,
  onClickDeleteClose,
  onClickDelete,
  onClickEditOpen,
  onClickEditClose,
  onClickSaveEdit,
  onChangeNewGroupName,
  onClickSaveNewGroup,
  selectedGroup,
  setSelectedGroup,
  isToastShown,
  toastText,
  toastColor,
  setIsToastShown,
}: GroupManagementViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  return (
    <>
      <GroupManagementContainer>
        {/* 그룹 목록 */}
        <GroupListContainer>
          {/* 타이틀 */}
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {t('groupList')}
          </MainText>
          {/* 새 그룹 추가 창*/}
          <AddContainer>
            <BorderInput
              value={newGroupName}
              onChange={onChangeNewGroupName}
              borderColor={GRAY.SEMI_LIGHT}
            />
            <Button
              width={80}
              text={t('button.add')}
              onClick={onClickSaveNewGroup}
              borderColor={GRAY.SEMI_LIGHT}
              backgroundColor={WHITE}
              color={GRAY.DARK}
            />
          </AddContainer>
          {/* 그룹 목록 */}
          <GroupList
            selectedGroupId={selectedGroup.id}
            setSelectedGroup={setSelectedGroup}
          />
        </GroupListContainer>
        {/* 그룹원 목록 */}
        <GroupInformationContainer $isGroup={!!selectedGroup.id}>
          {/* 헤더 */}
          <GroupInformationHeader>
            <MainText size={SIZE.LARGE} fontWeight={600}>
              {selectedGroup.name}
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
          </GroupInformationHeader>
          {/* 컨텐츠 */}
          {selectedGroup.id && <GroupMember group={selectedGroup} />}
        </GroupInformationContainer>
      </GroupManagementContainer>
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
        headerTitle={t('title.editGroupName')}
      >
        <EditContainer>
          <LabelInput
            label={t('groupName')}
            value={editName}
            onChange={onChangeEditGroupName}
            placeholder={t('placeholder.groupName')}
          />
        </EditContainer>
      </CustomPopup>
      {/* 그룹 삭제 팝업 */}
      <ConfirmPopup
        isShow={isDeleteShown}
        onClickLeftButton={onClickDeleteClose}
        onClickRightButton={onClickDelete}
        title={t_popup('deleteGroupTitle')}
        body={t_popup('deleteGroupBody')}
        buttonNum={2}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
      />
    </>
  );
};

export default GroupManagementView;
