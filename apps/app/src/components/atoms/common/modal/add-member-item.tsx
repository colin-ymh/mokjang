import React from 'react';
import styled from 'styled-components';

import { Member } from '@mokjang/models';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { CheckButton } from '@mokjang/components';
import { BLANK } from '@mokjang/constants';
import ProfileImage from '../image/profile-image';
import { MainText } from '@mokjang/components';
import { getFormattedPhone } from '@mokjang/utils';
import { getTranslatedAge } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';
import { getAge, getDateFromDateString } from '@mokjang/utils';
import { useI18n } from '../../../../../locales/client';
import { MainTag } from '@mokjang/components';

const ItemContainer = styled.div<{
  $isEnable: boolean;
  $isSelected: boolean;
}>`
  display: flex;
  padding: 20px;
  gap: 20px;
  align-items: center;
  cursor: ${({ $isEnable }) => ($isEnable ? 'pointer' : 'not-allowed')};
  transition: background-color 0.2s;
  border: 1px solid ${GRAY.EXTRA_LIGHT};
  border-bottom: 0;

  background-color: ${({ $isSelected, $isEnable }) =>
    $isEnable ? ($isSelected ? MAIN.EXTRA_LIGHT : WHITE) : WHITE};

  &:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &:last-child {
    border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

type AddMemberItemProps = {
  member: Member;
  isEnable: boolean;
  isSelected: boolean;
  onClick: (member: Member) => void;
};

const AddMemberItem = ({
  member,
  isEnable,
  isSelected,
  onClick,
}: AddMemberItemProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <ItemContainer
      $isEnable={isEnable}
      $isSelected={isSelected}
      onClick={() => {
        isEnable && onClick(member);
      }}
    >
      <CheckButton
        value={isSelected}
        isStopPropagation={false}
        disabled={!isEnable}
      />
      <ProfileContainer>
        <ProfileImage value={member?.profileImageUrl} />
        <ProfileDetail>
          <RowContainer>
            <MainText>{`${member.name} ${member.officer?.name || BLANK}`}</MainText>
            <MainText color={GRAY.DEFAULT}>
              {member.birth &&
                `(${getTranslatedAge(
                  locale,
                  getAge(getDateFromDateString(member.birth))
                )})`}
            </MainText>
          </RowContainer>
          <RowContainer>
            <MainTag title={member.group?.name || t('noGroup')} />
            <MainText color={GRAY.SEMI_DARK}>
              {member.mobilePhone && getFormattedPhone(member.mobilePhone)}
            </MainText>
          </RowContainer>
        </ProfileDetail>
      </ProfileContainer>
    </ItemContainer>
  );
};

export default AddMemberItem;
