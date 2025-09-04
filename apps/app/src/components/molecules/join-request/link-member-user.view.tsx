import styled from 'styled-components';
import React, { ChangeEvent, Ref, RefObject } from 'react';
import { Member } from '@mokjang/models';
import { useI18n } from '../../../../locales/client';
import {
  BorderInput,
  MainText,
  SvgIcon,
} from '../../../../../../packages/components/src';
import { GRAY, MAIN } from '../../../../../../packages/constants/src';
import MemberProfile from '@/components/atoms/member/member-profile';
import AddMemberItem from '@/components/atoms/common/modal/add-member-item';
import { Svg } from '@mokjang/assets';

const LinkMemberUserViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  overflow: hidden;
  gap: 10px;
`;

const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProfileContainer = styled.div`
  display: flex;
  border: 1px solid ${MAIN.LIGHT};
  background-color: ${MAIN.EXTRA_LIGHT};
  border-radius: 10px;
  padding: 10px;
`;

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

type LinkMemberUserViewProps = {
  prevMember?: Member;
  searchRef: Ref<HTMLInputElement>;
  scrollRef: RefObject<HTMLDivElement>; // ✅ 스크롤 div에 연결
  selectedMember: Member;
  searchName: string;
  searchedMembers: Member[];
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void; // ✅ 스크롤 핸들러
};

const LinkMemberUserView = ({
  searchRef,
  scrollRef,
  prevMember,
  selectedMember,
  searchName,
  searchedMembers,
  onChangeSearch,
  onClickMember,
  onClickSearch,
  onKeyDown,
  onScroll,
}: LinkMemberUserViewProps) => {
  const t = useI18n();

  const showMemberHeader = Boolean(selectedMember?.id || prevMember);

  return (
    <LinkMemberUserViewContainer>
      {showMemberHeader && (
        <MemberContainer>
          <MainText fontSize={14} fontWeight={500} color={GRAY.DARK}>
            {selectedMember?.id
              ? t('selectedLinkedMember')
              : t('currentLinkedMember')}
          </MainText>
          <ProfileContainer>
            {selectedMember?.id ? (
              <MemberProfile member={selectedMember} />
            ) : (
              prevMember && <MemberProfile member={prevMember} />
            )}
          </ProfileContainer>
        </MemberContainer>
      )}

      {/* 검색창 */}
      <BorderInput
        ref={searchRef}
        value={searchName}
        onChange={onChangeSearch}
        onKeyDown={onKeyDown}
        height={40}
        placeholder={t('placeholder.name')}
        icon={<SvgIcon svg={Svg.Search} size={18} color={GRAY.DEFAULT} />}
      />

      {/* 교인 목록 */}
      <MemberListContainer ref={scrollRef} onScroll={onScroll}>
        {searchedMembers.map((member) => (
          <AddMemberItem
            key={member.id}
            member={member}
            isEnable={prevMember?.id !== member.id}
            isSelected={selectedMember.id === member.id}
            onClick={onClickMember}
          />
        ))}
      </MemberListContainer>
    </LinkMemberUserViewContainer>
  );
};

export default LinkMemberUserView;
