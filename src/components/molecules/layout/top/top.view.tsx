import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { SIDE_ID } from '@/constants/layout/header';

import Bell from '../../../../../public/svg/bell.svg';
import Setting from '../../../../../public/svg/setting.svg';
import Question from '../../../../../public/svg/question.svg';
import Home from '../../../../../public/svg/home.svg';

const TopContainer = styled.div`
  display: none;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    padding: 10px 20px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${GRAY.LIGHT};
    background-color: ${GRAY.SIDE_BAR};
  }
`;

const TopLeft = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const TopRight = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ChurchImage = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${GRAY.LIGHT};
  border-radius: 5px;
`;

const NotificationButton = styled(Bell)`
  width: 25px;
  height: 25px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.LIGHT};
    border-radius: 5px;
  }
`;

const ManagementButton = styled(Setting)`
  width: 25px;
  height: 25px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.LIGHT};
    border-radius: 5px;
  }
`;

const GuideButton = styled(Question)`
  width: 25px;
  height: 25px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.LIGHT};
    border-radius: 5px;
  }
`;

const MainButton = styled(Home)`
  width: 25px;
  height: 25px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.LIGHT};
    border-radius: 5px;
  }
`;

type TopViewProps = {
  onClickButton: (id: SIDE_ID) => void;
};

const TopView = ({ onClickButton }: TopViewProps) => {
  const { church } = useSelector((state: RootState) => state.church);

  return (
    <TopContainer>
      <TopLeft>
        <ChurchImage />
        <MainText size={SIZE.EXTRA_LARGE}>{church.name}</MainText>
      </TopLeft>
      <TopRight>
        <MainButton onClick={() => onClickButton(SIDE_ID.MAIN)} />
        <NotificationButton
          onClick={() => onClickButton(SIDE_ID.NOTIFICATION)}
        />
        <ManagementButton onClick={() => onClickButton(SIDE_ID.MANAGEMENT)} />
        <GuideButton onClick={() => onClickButton(SIDE_ID.GUIDE)} />
      </TopRight>
    </TopContainer>
  );
};

export default TopView;
