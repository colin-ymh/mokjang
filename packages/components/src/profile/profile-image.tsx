'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { GRAY } from '@mokjang/constants';
import { Png } from '@mokjang/assets';

const Profile = styled(Image)<{ $isButton: boolean }>`
  border-radius: 100%;
  object-fit: cover;
  background: ${GRAY.SEMI_LIGHT};
  cursor: ${({ $isButton }) => ($isButton ? 'pointer' : 'default')};
`;
type ProfileImageProps = {
  value?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  quality?: number;
};

export const ProfileImage = ({
  value,
  width = 30,
  height = 30,
  quality = 100,
  onClick,
}: ProfileImageProps) => {
  return (
    <Profile
      src={value || Png.DefaultMemberImage}
      alt="profileImage"
      width={width}
      height={height}
      quality={quality}
      onClick={onClick}
      $isButton={!!onClick}
    />
  );
};
