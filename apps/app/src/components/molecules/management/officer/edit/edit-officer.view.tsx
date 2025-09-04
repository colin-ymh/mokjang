import styled from 'styled-components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import ConfirmPopup from '../../../../atoms/common/popup/confirm-popup';
import { Officer } from '@mokjang/models';
import { LabelInput } from '@mokjang/components';
import DeleteWarningButton from '../../../../atoms/common/button/delete-warning-button';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

type EditOfficerViewProps = {
  editName: string;
  onChangeEditOfficerName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOfficer: Officer;
  isDeleteShown: boolean;
  onClickDeleteOpen: () => void;
  onClickDeleteClose: () => void;
  onClickDelete: () => void;
};

const EditOfficerView = ({
  editName,
  onChangeEditOfficerName,
  selectedOfficer,
  isDeleteShown,
  onClickDeleteOpen,
  onClickDeleteClose,
  onClickDelete,
}: EditOfficerViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_warning = useScopedI18n('warning');

  return (
    <>
      <EditContainer>
        <LabelInput
          label={t('officerName')}
          value={editName}
          onChange={onChangeEditOfficerName}
          placeholder={t('placeholder.officerName')}
        />
        <DeleteWarningButton
          description={t_warning('deleteOfficer')}
          buttonText={t_button('deleteOfficer')}
          onClick={onClickDeleteOpen}
          disabled={!!selectedOfficer?.membersCount || false}
        />
      </EditContainer>

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

export default EditOfficerView;
