import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { Member } from '@/models/member/member';
import { Group } from '@/models/setting/setting';
import BorderInput from '@/components/atoms/common/input/border-input';
import AddMemberItem from '@/components/atoms/setting/group/add-member-item';
import Button from '@/components/atoms/common/button/button';

import Cancel from '../../../../public/svg/cancel.svg';
import { useI18n } from '../../../../locales/client';
import { getCurrentGroup } from '@/utils/history';

const ModalContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: column;
  width: auto;
  background-color: ${WHITE};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  height: 420px;
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
  flex-direction: row;
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  padding: 0 20px 10px 20px;
`;

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 330px;
  overflow-y: scroll;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const SelectedMemberContainer = styled.div<{ $isShown: boolean }>`
  display: flex;
  width: ${({ $isShown }) => ($isShown ? '300px' : '0')};
  flex-direction: column;
  transition: width 0.2s;
`;

const SelectedMemberList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  overflow-y: scroll;
  height: 320px;
`;

type AddGroupMemberModalViewProps = {
  group: Group;
  isShown: boolean;
  searchName: string;
  searchedMembers: Member[];
  selectedMembers: Member[];
  resetData: () => void;
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
  onClickClose: () => void;
  onClickSave: () => void;
};

const AddGroupMemberModalView = ({
  group,
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
      {/* 내용 */}
      <ContentContainer>
        <AddContainer>
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
                  key={member.id}
                  member={member}
                  isEnable={group.id !== getCurrentGroup(member.group)?.groupId}
                  selectedMembers={selectedMembers}
                  onClick={onClickMember}
                />
              );
            })}
          </MemberListContainer>
        </AddContainer>
        <SelectedMemberContainer $isShown={selectedMembers.length > 0}>
          <SelectedMemberList>
            {selectedMembers.map((member) => {
              return (
                <AddMemberItem
                  key={member.id}
                  member={member}
                  isEnable={group.id !== getCurrentGroup(member.group)?.groupId}
                  selectedMembers={selectedMembers}
                  onClick={onClickMember}
                />
              );
            })}
          </SelectedMemberList>
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
        </SelectedMemberContainer>
      </ContentContainer>
    </ModalContainer>
  );
};

export default AddGroupMemberModalView;
