import styled from 'styled-components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { Ministry } from '../../../../../models/management/management';
import LabelInput from '../../../common/input/label-input';
import { MainText } from '../../../common/text/main-text';
import MainTag from '../../../common/tag/main-tag';
import { GRAY } from '../../../../../constants/styles/color';
import DeleteWarningButton from '../../../common/button/delete-warning-button';
import ConfirmPopup from '../../../common/popup/confirm-popup';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const MinistryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MinistryList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

type EditMinistryViewProps = {
  ministries: Ministry[];
  editName: string;
  onChangeEditMinistryName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  isDeleteShown: boolean;
  onClickDeleteOpen: () => void;
  onClickDeleteClose: () => void;
  onClickDelete: () => void;
  selectedMinistry?: Ministry;
};

const EditMinistryView = ({
  editName,
  ministries,
  onChangeEditMinistryName,
  isDeleteShown,
  onClickDeleteOpen,
  onClickDeleteClose,
  onClickDelete,
  selectedMinistry,
}: EditMinistryViewProps) => {
  const t = useI18n();
  const t_warning = useScopedI18n('warning');
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  return (
    <>
      <EditContainer>
        <LabelInput
          label={t('ministryName')}
          value={editName}
          onChange={onChangeEditMinistryName}
          placeholder={t('placeholder.ministryName')}
        />
        <MinistryListContainer>
          <MainText color={GRAY.DARK}>{t('currentMinistry')}</MainText>
          <MinistryList>
            {ministries.map((ministry) => (
              <MainTag key={ministry.id} title={ministry.name} />
            ))}
          </MinistryList>
        </MinistryListContainer>

        {/* 삭제 */}
        {selectedMinistry?.id && (
          <DeleteWarningButton
            description={t_warning('deleteMinistry')}
            buttonText={t_button('deleteMinistry')}
            onClick={onClickDeleteOpen}
            disabled={!!selectedMinistry?.membersCount || false}
          />
        )}
      </EditContainer>

      {/* 사역 삭제 팝업 */}
      <ConfirmPopup
        isShow={isDeleteShown}
        onClickLeftButton={onClickDeleteClose}
        onClickRightButton={onClickDelete}
        title={t_popup('deleteMinistryTitle')}
        body={t_popup('deleteMinistryBody')}
        buttonNum={2}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
      />
    </>
  );
};

export default EditMinistryView;
