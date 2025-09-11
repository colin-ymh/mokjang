'use client';

import React, { useMemo } from 'react';
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
  const profiles = [
    Png.DefaultMemberImage,
    Png.Man1,
    Png.Man2,
    Png.Man3,
    Png.Man4,
    Png.Man5,
    Png.Man6,
    Png.Woman1,
    Png.Woman2,
    Png.Woman3,
    Png.Woman4,
  ];

  const getRandomImage = useMemo(() => {
    const index = Math.round(Math.random() * 10000) % 10;
    return profiles[index];
  }, []);

  return (
    <Profile
      src={value || getRandomImage}
      alt="profileImage"
      width={width}
      height={height}
      quality={quality}
      onClick={onClick}
      $isButton={!!onClick}
    />
  );
};
