import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Member } from '../../../models/member/member';
import { GRAY } from '../../../constants/styles/color';
import CheckButton from '../common/button/check-button';
import MemberProfile from '../member/member-profile';
import { MainText } from '../common/text/main-text';
import { getFormattedMobilePhone } from '../../../utils/format';

const BackgroundContainer = styled.div`
  display: flex;
  position: relative;
  padding: 5px 0;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
`;

const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
`;

const ButtonContainer = styled.div`
  position: absolute;
  right: 10px;
`;

type LinkMemberItemProps = {
  member: Member;
  isSelected: boolean;
  onClick: (member: Member) => void;
};

const LinkMemberItem = ({
  member,
  isSelected,
  onClick,
}: LinkMemberItemProps) => {
  return (
    <BackgroundContainer>
      <ItemContainer
        onClick={() => {
          onClick(member);
        }}
      >
        <MemberProfile member={member} />
        <MainText>{member?.group && `(${member?.group?.name})`}</MainText>
        <MainText>
          {member.mobilePhone && getFormattedMobilePhone(member.mobilePhone)}
        </MainText>
        <ButtonContainer>
          <CheckButton value={isSelected} isStopPropagation={false} />
        </ButtonContainer>
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default LinkMemberItem;
