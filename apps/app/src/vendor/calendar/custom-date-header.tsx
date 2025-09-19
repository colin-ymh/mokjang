import { DateHeaderProps } from 'react-big-calendar';
import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { GRAY, MAIN, RED, WHITE } from '@mokjang/constants';
import { getDateStringFromDate } from '@mokjang/utils';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
`;

const DateContainer = styled.div<{ color?: string }>`
  display: flex;
  padding: 5px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
`;

const CustomDateHeader = ({ date, isOffRange, label }: DateHeaderProps) => {
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  const isToday =
    getDateStringFromDate(new Date()) === getDateStringFromDate(date);

  const getTextColor = () => {
    if (isToday) {
      return WHITE;
    } else if (isOffRange) {
      return GRAY.LIGHT;
    } else if (isSunday) {
      return RED.DEFAULT;
    } else if (isSaturday) {
      return MAIN.DEFAULT;
    } else {
      return GRAY.DARK;
    }
  };

  return (
    <HeaderContainer>
      <DateContainer color={isToday ? MAIN.DEFAULT : undefined}>
        <MainText color={getTextColor()}>{label}</MainText>
      </DateContainer>
    </HeaderContainer>
  );
};

export default CustomDateHeader;
