import { Member } from '@/models/member/member';
import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import ProfileImage from '@/components/atoms/common/image/profile-image';

const ProfileContainer = styled.div<{ $isButton: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: ${({ $isButton }) => ($isButton ? 'pointer' : 'default')};
`;

const ButtonText = styled(MainText)``;

type MemberProfileProps = {
  member: Member;
  onClick?: () => void;
};

const MemberProfile = ({ member, onClick }: MemberProfileProps) => {
  return (
    <ProfileContainer
      $isButton={!!onClick}
      onClick={(event) => {
        event.stopPropagation();
        onClick && onClick();
      }}
    >
      <ProfileImage value={member?.profileImageUrl} onClick={onClick} />
      <ButtonText>
        {`${member.name} ${member.officer?.name || BLANK}`}
      </ButtonText>
    </ProfileContainer>
  );
};

export default MemberProfile;
