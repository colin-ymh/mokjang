import styled from 'styled-components';
import { MainText } from '../text/main-text';
import { MAIN } from '@/constants/styles/color';
import ProfileImage from '../image/profile-image';
import Cancel from '../../../../../public/svg/cancel.svg';
import SvgIcon from '../icon/svg-icon';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: inline-flex;
  flex-direction: row;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 100px;
  padding: 5px 8px;
  gap: 5px;
  align-items: center;
  cursor: pointer;
`;

type MemberTagProps = {
  profileImage?: string;
  name?: string;
  officer?: string;
  backgroundColor?: string;
  color?: string;
  onClick?: () => void;
};

const MemberTag = ({
  profileImage,
  name,
  officer,
  backgroundColor = MAIN.EXTRA_LIGHT,
  color = MAIN.DEFAULT,
  onClick,
}: MemberTagProps) => {
  return (
    <TagContainer $backgroundColor={backgroundColor} onClick={onClick}>
      <ProfileImage value={profileImage} width={20} height={20} />
      <MainText color={color}>{name}</MainText>
      <MainText color={color}>{officer}</MainText>
      <SvgIcon color={color} svg={Cancel} size={12} />
    </TagContainer>
  );
};

export default MemberTag;
