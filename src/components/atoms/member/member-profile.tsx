import { Member } from '@/models/member/member';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getRandomImage } from '@/utils/image';
import { MEMBER } from '@/constants/member/member-column';
import { BLANK } from '@/constants/constant';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  overflow: hidden;
`;

const ButtonText = styled(MainText)`
  cursor: pointer;
`;

type MemberProfileProps = {
  member: Member;
  onClick?: () => void;
};

const MemberProfile = ({ member, onClick }: MemberProfileProps) => {
  return (
    <ProfileContainer>
      <ProfileImage
        src={getRandomImage(member.id)}
        alt={MEMBER.PROFILE_IMAGE}
      />
      <ButtonText
        onClick={(event) => {
          event.stopPropagation();
          onClick && onClick();
        }}
      >
        {`${member.name} ${member.officer?.name || BLANK}`}
      </ButtonText>
    </ProfileContainer>
  );
};

export default MemberProfile;
