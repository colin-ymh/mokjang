import { Member } from '@/models/member/member';
import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import ProfileImage from '@/components/atoms/common/image/profile-image';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
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
      <ProfileImage value={member?.profileImageUrl} />
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
