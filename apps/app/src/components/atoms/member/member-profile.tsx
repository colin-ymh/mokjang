import { Member } from '@mokjang/models';
import React from 'react';
import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { BLANK } from '@mokjang/constants';
import ProfileImage from '../common/image/profile-image';

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
  isOfficerShown?: boolean;
  isProfileImageShown?: boolean;
  width?: number;
  height?: number;
};

const MemberProfile = ({
  member,
  onClick,
  isOfficerShown = true,
  isProfileImageShown = true,
  width,
  height,
}: MemberProfileProps) => {
  return (
    <ProfileContainer
      $isButton={!!onClick}
      onClick={(event) => {
        event.stopPropagation();
        onClick && onClick();
      }}
    >
      {isProfileImageShown && (
        <ProfileImage
          value={member?.profileImageUrl}
          onClick={onClick}
          width={width}
          height={height}
        />
      )}
      <ButtonText>
        {`${member.name} ${isOfficerShown ? member.officer?.name || BLANK : BLANK}`}
      </ButtonText>
    </ProfileContainer>
  );
};

export default MemberProfile;
