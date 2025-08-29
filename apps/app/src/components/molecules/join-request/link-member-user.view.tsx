import styled from 'styled-components';
import React, { ChangeEvent, Ref } from 'react';
import { Member } from '../../../models/member/member';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import LinkMemberItem from '../../atoms/join-request/link-member-item';
import SearchInput from '../../atoms/common/input/search-input';
import Button from '../../atoms/common/button/button';
import { MainText } from '../../atoms/common/text/main-text';
import { GRAY, WHITE } from '../../../constants/styles/color';
import { BLANK } from '../../../constants/constant';

const LinkMemberUserViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 10px;
  overflow: hidden;
`;

const SearchContainer = styled.div`
  display: flex;
`;

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

type LinkMemberUserViewProps = {
  searchRef: Ref<HTMLInputElement>;
  selectedMember: Member;
  searchName: string;
  searchedMembers: Member[];
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const LinkMemberUserView = ({
  searchRef,
  selectedMember,
  searchName,
  searchedMembers,
  onChangeSearch,
  onClickMember,
  onClickSearch,
  onKeyDown,
}: LinkMemberUserViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');

  return (
    <LinkMemberUserViewContainer>
      {/* 검색창 */}
      <SearchContainer>
        <SearchInput
          searchRef={searchRef}
          searchValue={searchName}
          onChangeSearchValue={onChangeSearch}
          placeholder={
            selectedMember
              ? `${selectedMember.name} ${selectedMember.officer?.name || BLANK}`
              : t('placeholder.name')
          }
          onClickSearch={onClickSearch}
          onKeyDown={onKeyDown}
        />
      </SearchContainer>
      {/* 교인 목록 */}
      <MemberListContainer>
        {searchedMembers.map((member) => {
          return (
            <LinkMemberItem
              key={member.id}
              member={member}
              onClick={onClickMember}
              isSelected={selectedMember.id === member.id}
            />
          );
        })}
      </MemberListContainer>
      <BottomContainer>
        <MainText color={GRAY.DEFAULT}>
          {'*해당 관리자와 연결할 교인정보가 없으시다면'}
        </MainText>
        <Button
          text={t_button('makeMemberInformation')}
          backgroundColor={WHITE}
          color={GRAY.SEMI_DARK}
          borderColor={GRAY.SEMI_LIGHT}
          height={30}
          width={150}
        />
      </BottomContainer>
    </LinkMemberUserViewContainer>
  );
};

export default LinkMemberUserView;
