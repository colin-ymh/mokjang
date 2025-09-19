import styled from 'styled-components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import ConfirmPopup from '../../../../atoms/common/popup/confirm-popup';
import { Group, Member } from '@mokjang/models';
import { LabelInput } from '@mokjang/components';
import DeleteWarningButton from '../../../../atoms/common/button/delete-warning-button';
import EditGroupLeader from '../../../../atoms/management/group/edit/edit-group-leader';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const BoxContainer = styled.div`
  display: flex;
`;

type EditGroupViewProps = {
  isDeleteShown: boolean;
  members: Member[];
  editName: string;
  onChangeEditGroupName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNewGroupLeaderId: (id: string) => void;
  selectedGroup: Group;
  onClickDeleteOpen: () => void;
  onClickDeleteClose: () => void;
  onClickDelete: () => void;
};

const EditGroupView = ({
  editName,
  members,
  onChangeEditGroupName,
  onChangeNewGroupLeaderId,
  selectedGroup,
  onClickDeleteOpen,
  isDeleteShown,
  onClickDeleteClose,
  onClickDelete,
}: EditGroupViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_warning = useScopedI18n('warning');

  return (
    <>
      <EditContainer>
        {/* 이름 변경 */}
        <LabelInput
          label={t('groupName')}
          value={editName}
          onChange={onChangeEditGroupName}
          placeholder={t('placeholder.groupName')}
        />
        {/* 그룹장 지정 */}
        <EditGroupLeader
          group={selectedGroup}
          members={members}
          onChangeLeaderId={onChangeNewGroupLeaderId}
        />

        {/* 삭제 */}
        <BoxContainer>
          <DeleteWarningButton
            description={t_warning('deleteGroup')}
            buttonText={t_button('deleteGroup')}
            onClick={onClickDeleteOpen}
            disabled={!!selectedGroup?.membersCount || false}
          />
        </BoxContainer>
      </EditContainer>

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

export default EditGroupView;
