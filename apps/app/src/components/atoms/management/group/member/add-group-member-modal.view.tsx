import React, { ChangeEvent, MutableRefObject } from 'react';
import styled from 'styled-components';
import { Member } from '../../../../../models/member/member';
import { Group } from '../../../../../models/management/management';
import BorderInput from '../../../common/input/border-input';
import AddMemberItem from '../../../common/modal/add-member-item';
import Search from '../../../../../../public/svg/search.svg';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '../../../common/text/main-text';
import { getTranslatedSelectedMemberCount } from '../../../../../utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../../constants/state/locale';
import { GRAY } from '../../../../../constants/styles/color';
import CustomDatePicker from '../../../../../vendor/date-picker/custom-date-picker';

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

const SearchIcon = styled(Search)`
  width: 14px;
  height: 14px;
`;

type AddGroupMemberModalViewProps = {
  group: Group;
  searchName: string;
  searchedMembers: Member[];
  selectedMembers: Member[];
  onChangeSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMember: (member: Member) => void;

  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
  startDate: Date | null;
  onChangeStartDate: (date: Date | null) => void;
};

const AddGroupMemberModalView = ({
  group,
  searchName,
  searchedMembers,
  selectedMembers,
  onChangeSearch,
  onClickMember,

  scrollRef,
  onScroll,
  startDate,
  onChangeStartDate,
}: AddGroupMemberModalViewProps) => {
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
      {/* 시작 날짜 */}
      <CustomDatePicker
        selected={startDate}
        onChange={onChangeStartDate}
        placeholderText={t('startDate')}
      />
      <RowContainer>
        <MainText color={GRAY.SEMI_DARK}>
          {getTranslatedSelectedMemberCount(locale, selectedMembers.length)}
        </MainText>
        <MainText color={GRAY.DEFAULT}>{t('description.addMember')}</MainText>
      </RowContainer>
      {/* 교인 목록 */}
      <MemberListContainer ref={scrollRef} onScroll={onScroll}>
        {searchedMembers.map((member) => {
          return (
            <AddMemberItem
              key={member.id}
              member={member}
              isEnable={group.id !== member.group?.id}
              isSelected={
                group.id === member.group?.id ||
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

export default AddGroupMemberModalView;
