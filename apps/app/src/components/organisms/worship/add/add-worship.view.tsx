import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { CustomPopup, LabelInput, LabelTextarea } from '@mokjang/components';
import LabelDropdown from '../../../atoms/common/dropdown/label-dropdown';
import {
  useDayDropdownItems,
  useRepeatPeriodDropdownItems,
} from '../../../../hooks/dropdown/dropdown-items';
import { Group } from '@mokjang/models';
import SelectGroupHierarchy from '../../group/select-group-hierarchy';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import DeleteWarningButton from '@/components/atoms/common/button/delete-warning-button';
import React from 'react';

const AddWorshipViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const LabelInputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
`;

const BoxContainer = styled.div`
  display: flex;
  padding: 20px 0;
`;

type AddWorshipViewProps = {
  selectedGroup: Group;
  isGroupModalShown: boolean;
  onClickGroupModalOpen: () => void;
  onClickGroupModalClose: () => void;
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeGroup: (groupId: string | null) => void;
  onChangeWorshipDay: (value: number) => void;
  onChangeRepeatPeriod: (value: number) => void;
  onChangeDescription: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClickDelete?: () => void;
};

const AddWorshipView = ({
  selectedGroup,
  isGroupModalShown,
  onClickGroupModalOpen,
  onClickGroupModalClose,
  onChangeTitle,
  onChangeGroup,
  onChangeWorshipDay,
  onChangeRepeatPeriod,
  onChangeDescription,
  onClickDelete,
}: AddWorshipViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const worshipDayDropdownItems = useDayDropdownItems();
  const repeatPeriodDropdownItems = useRepeatPeriodDropdownItems();

  return (
    <AddWorshipViewContainer>
      <LabelInput
        label={t('title')}
        placeholder={t_placeholder('worshipTitle')}
        value={targetWorship.title}
        onChange={onChangeTitle}
        isRequired={true}
        maxLength={50}
      />
      <LabelInputContainer>
        <LabelInput
          label={t('worshipGroup')}
          value={selectedGroup.name || t('all')}
          onClick={onClickGroupModalOpen}
          onChange={() => {}}
        />
      </LabelInputContainer>
      <RowContainer>
        <LabelDropdown
          label={t('worshipDay')}
          value={targetWorship.worshipDay}
          onChangeItem={onChangeWorshipDay}
          items={worshipDayDropdownItems}
        />
        {/*<LabelDropdown*/}
        {/*  label={t('repeatPeriod')}*/}
        {/*  value={targetWorship.repeatPeriod}*/}
        {/*  onChangeItem={onChangeRepeatPeriod}*/}
        {/*  items={repeatPeriodDropdownItems}*/}
        {/*/>*/}
      </RowContainer>
      <LabelTextarea
        label={t('description')}
        placeholder={t_placeholder('worshipDescription')}
        value={targetWorship.description}
        onChange={onChangeDescription}
        maxLength={500}
      />

      <CustomPopup
        isShow={isGroupModalShown}
        onClickClose={onClickGroupModalClose}
        onClickCancel={onClickGroupModalClose}
        cancelText={t_button('close')}
        width={400}
        height={400}
        isHeaderShown={false}
      >
        <GroupContainer>
          <SelectGroupHierarchy isDefaultOpen onChange={onChangeGroup} />
        </GroupContainer>
      </CustomPopup>

      {onClickDelete && (
        <BoxContainer>
          <DeleteWarningButton
            description={t_warning('deleteWorship')}
            buttonText={t_button('delete')}
            onClick={onClickDelete}
          />
        </BoxContainer>
      )}
    </AddWorshipViewContainer>
  );
};

export default AddWorshipView;
