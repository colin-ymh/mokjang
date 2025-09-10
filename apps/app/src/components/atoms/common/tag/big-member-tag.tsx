import styled from 'styled-components';
import { MainText, SvgIcon } from '@mokjang/components';
import { BLACK, GRAY, WHITE } from '@mokjang/constants';
import ProfileImage from '../image/profile-image';
import { Svg } from '@mokjang/assets';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: inline-flex;
  flex-direction: row;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 5px;
  padding: 0 10px;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  height: 40px;
  border: 1px solid ${GRAY.LIGHT};
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  backgroundColor = WHITE,
  color = BLACK,
  onClick,
}: MemberTagProps) => {
  return (
    <TagContainer $backgroundColor={backgroundColor} onClick={onClick}>
      <LeftContainer>
        <ProfileImage value={profileImage} width={20} height={20} />
        <InformationContainer>
          <MainText color={color}>{name}</MainText>
          {officer && <MainText color={color}>{officer}</MainText>}
        </InformationContainer>
      </LeftContainer>
      <SvgIcon color={color} svg={Svg.Cancel} size={12} />
    </TagContainer>
  );
};

export default MemberTag;
