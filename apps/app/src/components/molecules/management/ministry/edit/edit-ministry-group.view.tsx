import styled from 'styled-components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import ConfirmPopup from '../../../../atoms/common/popup/confirm-popup';
import { MinistryGroup } from '@mokjang/models';
import { LabelInput } from '@mokjang/components';
import DeleteWarningButton from '../../../../atoms/common/button/delete-warning-button';
import { Member } from '@mokjang/models';
import EditMinistryGroupLeader from '../../../../atoms/management/ministry/edit/edit-ministry-group-leader';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

type EditMinistryGroupViewProps = {
  isDeleteShown: boolean;
  members: Member[];
  editName: string;
  onChangeEditMinistryGroupName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onChangeNewMinistryGroupLeaderId: (id: string) => void;
  selectedMinistryGroup: MinistryGroup;
  onClickDeleteOpen: () => void;
  onClickDeleteClose: () => void;
  onClickDelete: () => void;
};

const EditMinistryGroupView = ({
  editName,
  members,
  onChangeEditMinistryGroupName,
  onChangeNewMinistryGroupLeaderId,
  selectedMinistryGroup,
  onClickDeleteOpen,
  isDeleteShown,
  onClickDeleteClose,
  onClickDelete,
}: EditMinistryGroupViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_warning = useScopedI18n('warning');

  return (
    <>
      <EditContainer>
        {/* 이름 변경 */}
        <LabelInput
          label={t('ministryGroupName')}
          value={editName}
          onChange={onChangeEditMinistryGroupName}
          placeholder={t('placeholder.ministryGroupName')}
        />
        {/* 그룹장 지정 */}
        <EditMinistryGroupLeader
          ministryGroup={selectedMinistryGroup}
          members={members}
          onChangeLeaderId={onChangeNewMinistryGroupLeaderId}
        />

        {/* 삭제 */}
        <DeleteWarningButton
          description={t_warning('deleteMinistryGroup')}
          buttonText={t_button('deleteMinistryGroup')}
          onClick={onClickDeleteOpen}
          disabled={!!selectedMinistryGroup?.membersCount || false}
        />
      </EditContainer>

      {/* 그룹 삭제 팝업 */}
      <ConfirmPopup
        isShow={isDeleteShown}
        onClickLeftButton={onClickDeleteClose}
        onClickRightButton={onClickDelete}
        title={t_popup('deleteMinistryGroupTitle')}
        body={t_popup('deleteMinistryGroupBody')}
        buttonNum={2}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
      />
    </>
  );
};

export default EditMinistryGroupView;
