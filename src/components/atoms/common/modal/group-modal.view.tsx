import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';
import { GRAY, MAIN } from '@/constants/styles/color';
import { Group } from '@/models/management/management';
import { GroupHistory } from '@/models/member/history';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import GroupDropdown from '@/components/atoms/common/dropdown/group-dropdown';

const GroupModalViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10px;
  height: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

type GroupModalViewProps = {
  isEdit: boolean;
  prevGroup: GroupHistory;
  selectedGroup: Group;
  isButtonEnabled: boolean;
  startDate: string;
  endDate: string;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickClose: () => void;
  onClickSaveNewGroup: (groupId: string, startDate: string) => void;
  onClickSaveEditGroup: (startDate: string, endDate: string) => void;
  onClickChild: (group: Group) => void;
};

const GroupModalView = ({
  isEdit,
  prevGroup,
  selectedGroup,
  isButtonEnabled,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onClickClose,
  onClickSaveNewGroup,
  onClickSaveEditGroup,
  onClickChild,
}: GroupModalViewProps) => {
  const t = useI18n();

  return (
    <GroupModalViewContainer>
      {/* 헤더 */}
      <HeaderContainer>
        <CancelButton onClick={onClickClose} />
      </HeaderContainer>
      {/* 내용 */}
      <ContentContainer>
        {/* 소그룹 선택 드롭다운 부분*/}
        <GroupDropdown
          value={
            isEdit ? prevGroup.groupName : selectedGroup?.name || t('none')
          }
          isEdit={isEdit}
          selectedGroup={selectedGroup}
          onClickChild={onClickChild}
        />
        {/* 시작 날짜 */}
        <LabelInput
          label={t('startDate')}
          value={startDate}
          onChange={onChangeStartDate}
          placeholder={t('placeholder.startDate')}
        />
        {/* 종료 날짜 */}
        {isEdit && (
          <LabelInput
            label={t('endDate')}
            value={endDate}
            onChange={onChangeEndDate}
            placeholder={t('placeholder.endDate')}
          />
        )}
      </ContentContainer>
      {/* 버튼 */}
      <ButtonContainer>
        <Button
          text={t('button.save')}
          disabled={!isButtonEnabled}
          backgroundColor={isButtonEnabled ? MAIN.DEFAULT : GRAY.LIGHT}
          height={30}
          onClick={() => {
            if (isEdit) {
              onClickSaveEditGroup(startDate, endDate);
            } else {
              onClickSaveNewGroup(selectedGroup.id as string, startDate);
            }
          }}
        />
      </ButtonContainer>
    </GroupModalViewContainer>
  );
};

export default GroupModalView;
