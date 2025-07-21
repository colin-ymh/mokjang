import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Member } from '@/models/member/member';
import { Ministry, MinistryGroup } from '@/models/management/management';
import BorderInput from '@/components/atoms/common/input/border-input';
import AddMemberItem from '@/components/atoms/common/modal/add-member-item';
import Search from '../../../../../../public/svg/search.svg';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getTranslatedSelectedMemberCount } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { GRAY } from '@/constants/styles/color';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { SIZE } from '@/constants/styles/style';

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
  ministryGroup: MinistryGroup;
  searchName: string;
  searchedMembers: Member[];
  selectedMembers: Member[];
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;
  ministries: Ministry[];
  selectedMinistryId: string;
  onChangeMinistryItem: (id: string) => void;
};

const AddMinistryGroupMemberModalView = ({
  ministryGroup,
  searchName,
  searchedMembers,
  selectedMembers,
  onChangeSearch,
  onClickMember,
  ministries,
  selectedMinistryId,
  onChangeMinistryItem,
}: AddMinistryGroupMemberModalViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const ministryDropdownItems: DropdownValueType[] = ministries.map(
    (ministry) => {
      return {
        value: ministry.id,
        title: ministry.name,
      };
    }
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
      {/* 사역 드롭다운 */}
      <DropdownContainer>
        <MainText color={GRAY.SEMI_DARK}>{t('defaultMinistry')}</MainText>
        <Dropdown
          value={selectedMinistryId}
          items={ministryDropdownItems}
          onChangeItem={onChangeMinistryItem}
          height={40}
        />
        <MainText color={GRAY.DEFAULT} size={SIZE.SMALL}>
          {t('description.defaultMinistry')}
        </MainText>
      </DropdownContainer>
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
              isEnable={true}
              // isEnable={member.ministries?.includes(ministryGroup)}
              isSelected={selectedMembers.some(
                (selectedMember) => selectedMember.id === member.id
              )}
              onClick={onClickMember}
            />
          );
        })}
      </MemberListContainer>
    </ModalContainer>
  );
};

export default AddMinistryGroupMemberModalView;
