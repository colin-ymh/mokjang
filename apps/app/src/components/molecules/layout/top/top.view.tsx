import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { MEDIA_MIN_WIDTH } from '../../../../constants/constant';
import { GRAY, WHITE } from '../../../../constants/styles/color';
import { SIDE_ID } from '../../../../constants/layout/header';

import Bell from '../../../../../public/svg/bell.svg';
import Setting from '../../../../../public/svg/setting.svg';
import Question from '../../../../../public/svg/question.svg';
import Home from '../../../../../public/svg/home.svg';
import Burger from '../../../../../public/svg/burger.svg';
import { DummyApi } from '../../../../api/dummy.api';
import SvgIcon from '../../../atoms/common/icon/svg-icon';
import { useParams } from 'next/navigation';

const TopContainer = styled.div`
  display: none;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    padding: 0 30px;
    height: 65px;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.7px solid ${GRAY.LIGHT};
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
  gap: 20px;
`;

type TopViewProps = {
  onClickButton: (id: SIDE_ID) => void;
  handleSideShow: () => void;
};

const TopView = ({ onClickButton, handleSideShow }: TopViewProps) => {
  const slug = useParams().slug as string[] | undefined;
  const sideId = slug?.[0] ?? null;
  const { church } = useSelector((state: RootState) => state.church);
  const dummyApi = new DummyApi(false);
  return (
    <TopContainer>
      <TopLeft>
        {/*<ChurchImage />*/}
        {/*<LogoutButton width={100} />*/}
        {/*<Button*/}
        {/*  text={'더미 교인 생성'}*/}
        {/*  width={100}*/}
        {/*  height={30}*/}
        {/*  color={WHITE}*/}
        {/*  onClick={() => {*/}
        {/*    dummyApi.createDummyMembers({ churchId: church.id });*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<MainText size={SIZE.LARGE}>{`초대코드 ${church?.joinCode}`}</MainText>*/}
        <SvgIcon
          svg={Burger}
          onClick={handleSideShow}
          size={24}
          width={1.5}
          color={GRAY.DARK}
        />
      </TopLeft>
      <TopRight>
        {sideId !== SIDE_ID.MAIN && (
          <SvgIcon
            svg={Home}
            onClick={() => onClickButton(SIDE_ID.MAIN)}
            size={22}
            width={1.5}
            color={GRAY.DARK}
          />
        )}
        {sideId !== SIDE_ID.NOTIFICATION && (
          <SvgIcon
            svg={Bell}
            onClick={() => onClickButton(SIDE_ID.NOTIFICATION)}
            size={22}
            width={1.5}
            color={GRAY.DARK}
          />
        )}
        {sideId !== SIDE_ID.MANAGEMENT && (
          <SvgIcon
            svg={Setting}
            onClick={() => onClickButton(SIDE_ID.MANAGEMENT)}
            size={22}
            width={1.5}
            color={GRAY.DARK}
          />
        )}
        {sideId !== SIDE_ID.GUIDE && (
          <SvgIcon
            svg={Question}
            onClick={() => onClickButton(SIDE_ID.GUIDE)}
            size={22}
            width={1.5}
            color={GRAY.DARK}
          />
        )}
      </TopRight>
    </TopContainer>
  );
};

export default TopView;
