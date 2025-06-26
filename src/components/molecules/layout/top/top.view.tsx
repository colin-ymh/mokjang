import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { GRAY, WHITE } from '@/constants/styles/color';
import { SIDE_ID } from '@/constants/layout/header';

import Bell from '../../../../../public/svg/bell.svg';
import Setting from '../../../../../public/svg/setting.svg';
import Question from '../../../../../public/svg/question.svg';
import Home from '../../../../../public/svg/home.svg';
import LogoutButton from '@/components/atoms/common/button/logout-button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

const TopContainer = styled.div`
  display: none;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    padding: 0 20px;
    height: 40px;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
    background-color: ${WHITE};
  }
`;

const TopLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  background-color: ${GRAY.SEMI_LIGHT};
  border-radius: 5px;
`;

const NotificationButton = styled(Bell)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
    border-radius: 5px;
  }
`;

const ManagementButton = styled(Setting)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
    border-radius: 5px;
  }
`;

const GuideButton = styled(Question)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
    border-radius: 5px;
  }
`;

const MainButton = styled(Home)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
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
        {/*<ChurchImage />*/}
        <LogoutButton width={100} />
        <MainText size={SIZE.LARGE}>{`초대코드 ${church.joinCode}`}</MainText>
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
