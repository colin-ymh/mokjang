'use client';

import styled from 'styled-components';
import { useScopedI18n } from '../../../../../locales/client';
import { Button, MainText } from '../../../../../../../packages/components/src';
import { GRAY, GREEN, MAIN } from '../../../../../../../packages/constants/src';

import BackgroundImage from '../../../../../public/png/hero-background.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const HeroContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 700px;
  overflow: hidden;
  align-items: center;
`;

const Background = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: ${({ $url }) => `url(${$url})`};
  background-size: cover;
  background-position: center;
  filter: blur(3px) brightness(0.99) saturate(0.9);
  transform: scale(1.05);
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 200px;
  gap: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export type HeroViewProps = {
  onClickCreateChurch: () => void;
  onClickJoin: () => void;
};

const HeroView = ({ onClickCreateChurch, onClickJoin }: HeroViewProps) => {
  const t_button = useScopedI18n('button');
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <HeroContainer>
      <Background $url={BackgroundImage.src} aria-hidden />
      <Overlay aria-hidden />
      <Content>
        <TitleContainer>
          <MainText fontSize={60} fontWeight={700}>
            {'교회를 위한'}
          </MainText>
          <MainText fontSize={60} fontWeight={700} color={MAIN.DEFAULT}>
            {'교인 관리와 일정 관리'}
          </MainText>
          <MainText fontSize={60} fontWeight={700}>
            {'테바'}
          </MainText>
        </TitleContainer>
        <DescriptionContainer>
          <MainText color={GRAY.DARK} fontSize={20}>
            {'현대적이고 직관적인 시스템으로 교회의 교적부 관리와 일정관리를'}
          </MainText>
          <MainText color={GRAY.DARK} fontSize={20}>
            {'더욱 효율적으로. 교인들과의 소통과 관리가 한 번에 해결됩니다.'}
          </MainText>
        </DescriptionContainer>
        {user?.id && (
          <ButtonContainer>
            <Button
              text={t_button('createChurch')}
              width={150}
              height={60}
              fontSize={18}
              onClick={onClickCreateChurch}
            />
            <Button
              text={t_button('join')}
              width={150}
              height={60}
              fontSize={18}
              onClick={onClickJoin}
              backgroundColor={GREEN.DEFAULT}
            />
          </ButtonContainer>
        )}
      </Content>
    </HeroContainer>
  );
};

export default HeroView;
