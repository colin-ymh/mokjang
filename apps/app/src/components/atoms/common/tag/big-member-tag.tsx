import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { BLACK, GRAY } from '@mokjang/constants';
import ProfileImage from '../image/profile-image';
import { Svg } from '@mokjang/assets';
import { SvgIcon } from '@mokjang/components';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: inline-flex;
  flex-direction: row;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 5px;
  padding: 10px;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  backgroundColor = GRAY.EXTRA_LIGHT,
  color = BLACK,
  onClick,
}: MemberTagProps) => {
  return (
    <TagContainer $backgroundColor={backgroundColor} onClick={onClick}>
      <LeftContainer>
        <ProfileImage value={profileImage} width={40} height={40} />
        <InformationContainer>
          <MainText color={color}>{name}</MainText>
          <MainText color={color}>{officer}</MainText>
        </InformationContainer>
      </LeftContainer>
      <SvgIcon color={color} svg={Svg.Cancel} size={12} />
    </TagContainer>
  );
};

export default MemberTag;
