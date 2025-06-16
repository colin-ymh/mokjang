'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { GRAY } from '@/constants/styles/color';
import defaultImage from '../../../../../public/png/default-member-image.png';

const Profile = styled(Image)<{ $isButton: boolean }>`
  border-radius: 15%;
  object-fit: cover;
  background: ${GRAY.SEMI_LIGHT};
    cursor: ${({ $isButton }) => ($isButton ? 'pointer' : 'default')};}
`;

type ProfileImageProps = {
  value?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  quality?: number;
};

const ProfileImage = ({
  value,
  width = 40,
  height = 40,
  quality = 100,
  onClick,
}: ProfileImageProps) => {
  return (
    <Profile
      src={value || defaultImage}
      alt="profileImage"
      width={width}
      height={height}
      quality={quality}
      onClick={onClick}
      $isButton={!!onClick}
    />
  );
};

export default ProfileImage;
