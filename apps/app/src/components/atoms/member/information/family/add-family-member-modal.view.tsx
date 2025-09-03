import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { FamilyMember, Member } from '@mokjang/models';
import { BorderInput } from '@mokjang/components';
import { Svg } from '@mokjang/assets';
import AddMemberItem from '../../../common/modal/add-member-item';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@mokjang/components';
import { getTranslatedSelectedMemberCount } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';
import { GRAY } from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
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

const SearchIcon = styled(Svg.Search)`
  width: 14px;
  height: 14px;
`;

type AddFamilyMemberModalViewProps = {
  familyMembers: FamilyMember[];
  searchName: string;
  searchedMembers: Member[];
  selectedMembers: Member[];
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
};

const AddFamilyMemberModalView = ({
  familyMembers,
  searchName,
  searchedMembers,
  selectedMembers,
  onChangeSearch,
  onClickMember,
}: AddFamilyMemberModalViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

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
        <MainText color={GRAY.DEFAULT}>{t('description.addMember')}</MainText>
      </RowContainer>
      {/* 교인 목록 */}
      <MemberListContainer>
        {searchedMembers.map((member) => {
          return (
            <AddMemberItem
              key={member.id}
              member={member}
              isEnable={
                familyMembers.every(
                  (familyMember) => familyMember.familyMemberId !== member.id
                ) && member.id !== targetMember.id
              }
              isSelected={
                member.id === targetMember.id ||
                familyMembers.some(
                  (familyMember) => familyMember.familyMemberId === member.id
                ) ||
                selectedMembers.some(
                  (selectedMember) => selectedMember.id === member.id
                )
              }
              onClick={onClickMember}
            />
          );
        })}
      </MemberListContainer>
    </ModalContainer>
  );
};

export default AddFamilyMemberModalView;
