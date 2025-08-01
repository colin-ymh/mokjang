import React, { ChangeEvent, MutableRefObject } from 'react';
import styled from 'styled-components';
import { Member } from '@/models/member/member';
import BorderInput from '@/components/atoms/common/input/border-input';
import AddMemberItem from '@/components/atoms/common/modal/add-member-item';
import Search from '../../../../../public/svg/search.svg';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getTranslatedSelectedMemberCount } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { GRAY } from '@/constants/styles/color';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
`;

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SearchIcon = styled(Search)`
  width: 14px;
  height: 14px;
`;

type AddMinistryGroupMemberModalViewProps = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  searchName: string;
  searchedMembers: Member[];
  selectedMembers: Member[];
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
  onScroll: () => void;
};

const AddEnrollmentMemberModalView = ({
  scrollRef,
  searchName,
  searchedMembers,
  selectedMembers,
  onChangeSearch,
  onClickMember,
  onScroll,
}: AddMinistryGroupMemberModalViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <ModalContainer>
      {/* 검색창 */}
      <BorderInput
        value={searchName}
        onChange={onChangeSearch}
        height={40}
        placeholder={t('placeholder.name')}
        icon={<SearchIcon />}
      />
      <RowContainer>
        <MainText color={GRAY.SEMI_DARK}>
          {getTranslatedSelectedMemberCount(locale, selectedMembers.length)}
        </MainText>
        <MainText color={GRAY.DEFAULT}>
          {t('description.addMinistryMember')}
        </MainText>
      </RowContainer>
      {/* 교인 목록 */}
      <MemberListContainer ref={scrollRef} onScroll={onScroll}>
        {searchedMembers.map((member) => {
          return (
            <AddMemberItem
              key={member.id}
              member={member}
              isEnable={
                !(member.ministryGroups && member.ministryGroups?.length > 0)
              }
              isSelected={
                selectedMembers.some(
                  (selectedMember) => selectedMember.id === member.id
                ) ||
                (member.ministryGroups && member.ministryGroups?.length > 0) ||
                false
              }
              onClick={onClickMember}
            />
          );
        })}
      </MemberListContainer>
    </ModalContainer>
  );
};

export default AddEnrollmentMemberModalView;
