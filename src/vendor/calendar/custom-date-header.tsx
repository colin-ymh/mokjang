import { DateHeaderProps } from 'react-big-calendar';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 5px;
`;

const CustomDateHeader = ({ date, label }: DateHeaderProps) => {
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  return (
    <HeaderContainer>
      <MainText
        size={SIZE.LARGE}
        fontWeight={500}
        color={isSunday ? 'red' : isSaturday ? 'blue' : 'black'}
      >
        {label}
      </MainText>
    </HeaderContainer>
  );
};

export default CustomDateHeader;
