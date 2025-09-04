'use client';

import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { GRAY } from '@mokjang/constants';
// import defaultImage from '../../../../../public/png/default-member-image.png';
// import profile1 from '../../../../../public/png/profile1.jpeg';
// import profile2 from '../../../../../public/png/profile2.jpeg';
// import profile3 from '../../../../../public/png/profile3.jpeg';
// import profile4 from '../../../../../public/png/profile4.jpeg';
// import profile5 from '../../../../../public/png/profile5.jpeg';
// import profile6 from '../../../../../public/png/profile6.jpeg';
import profile7 from '../../../../../public/png/profile7.jpeg';
// import profile8 from '../../../../../public/png/profile8.jpeg';
// import profile9 from '../../../../../public/png/profile9.jpeg';
// import profile10 from '../../../../../public/png/profile10.jpeg';
// import profile11 from '../../../../../public/png/profile11.jpeg';

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

const ProfileImage = ({
  value,
  width = 30,
  height = 30,
  quality = 100,
  onClick,
}: ProfileImageProps) => {
  // const profiles = [
  //   profile1,
  //   profile2,
  //   profile3,
  //   profile4,
  //   profile5,
  //   profile6,
  //   profile7,
  //   profile8,
  //   profile9,
  //   profile10,
  //   profile11,
  //   defaultImage,
  // ];
  // const getRandomImage = () => {
  //   const index = Math.round(Math.random() * 10000) % 12;
  //   return profiles[index];
  // };
  return (
    <Profile
      src={value || profile7}
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
