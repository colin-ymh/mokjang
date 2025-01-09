import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';

import Cancel from '../../../../public/svg/cancel.svg';
import { Member } from '@/models/member/member';
import BorderInput from '@/components/atoms/common/input/border-input';
import { useI18n } from '../../../../locales/client';
import AddMemberItem from '@/components/atoms/setting/add-member-item';
import Button from '@/components/atoms/common/button/button';

const ModalContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: column;
  width: 300px;
  background-color: ${WHITE};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10px;
  height: 30px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 300px;
  overflow-y: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
`;

type AddGroupMemberModalViewProps = {
  isShown: boolean;
  searchName: string;
  searchedMembers: Member[];
  selectedMembers: string[];
  resetData: () => void;
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
  onClickClose: () => void;
  onClickSave: () => void;
};

const AddGroupMemberModalView = ({
  isShown,
  searchName,
  searchedMembers,
  selectedMembers,
  resetData,
  onChangeSearch,
  onClickMember,
  onClickClose,
  onClickSave,
}: AddGroupMemberModalViewProps) => {
  const t = useI18n();
  return (
    <ModalContainer $isShown={isShown}>
      {/* 헤더 */}
      <HeaderContainer>
        <CancelButton
          onClick={() => {
            onClickClose();
            resetData();
          }}
        />
      </HeaderContainer>
      {/* 검색창 */}
      <SearchContainer>
        <BorderInput
          value={searchName}
          onChange={onChangeSearch}
          height={30}
          placeholder={t('placeholder.name')}
        />
      </SearchContainer>
      {/* 교인 목록 */}
      <MemberListContainer>
        {searchedMembers.map((member) => {
          return (
            <AddMemberItem
              member={member}
              selectedMembers={selectedMembers}
              onClick={onClickMember}
            />
          );
        })}
      </MemberListContainer>
      {/* 저장 버튼 */}
      <ButtonContainer>
        <Button
          text={t('button.save')}
          height={30}
          onClick={onClickSave}
          backgroundColor={
            selectedMembers.length > 0 ? MAIN.DEFAULT : GRAY.LIGHT
          }
        />
      </ButtonContainer>
    </ModalContainer>
  );
};

export default AddGroupMemberModalView;
