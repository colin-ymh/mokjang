'use client';

import styled from 'styled-components';
import { useScopedI18n } from '../../../../../locales/client';
import { Button } from '@mokjang/components';
import { GREEN, LOCALE, MEDIA_MAX_WIDTH } from '@mokjang/constants';

import BackgroundImage from '../../../../../public/png/hero-background.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  getTranslatedHeroDescription,
  getTranslatedHeroTitle,
} from '@/hooks/translate/translate';
import { usePathname } from 'next/navigation';

const HeroContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 600px;
  overflow: hidden;
  align-items: center;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding: 0 20px;
    width: auto;
  }
`;

const Background = styled.div<{ $url: string }>`
  position: absolute;
  inset: 0;
  background-image: ${({ $url }) => `url(${$url})`};
  background-size: cover;
  background-position: center;
  filter: blur(1px) brightness(0.99) saturate(0.9);
  transform: scale(1.05);
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 200px;
  gap: 50px;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding: 0;
    width: 100%;
  }
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
  width: 200px;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    flex-direction: column;
    width: 100%;
  }
`;

export type HeroViewProps = {
  onClickOpenChurch: () => void;
  onClickCreateChurch: () => void;
  onClickJoin: () => void;
  onClickStart: () => void;
  onClickDonate: () => void;
};

const HeroView = ({
  onClickOpenChurch,
  onClickCreateChurch,
  onClickJoin,
  onClickStart,
  onClickDonate,
}: HeroViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t_button = useScopedI18n('button');
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <HeroContainer>
      <Background $url={BackgroundImage.src} aria-hidden />
      <Overlay aria-hidden />
      <Content>
        <TitleContainer>{getTranslatedHeroTitle(locale)}</TitleContainer>
        <DescriptionContainer>
          {getTranslatedHeroDescription(locale)}
        </DescriptionContainer>
        {user?.id ? (
          user.churchUser.length > 0 ? (
            <ButtonContainer>
              <Button
                borderRadius={10}
                text={t_button('openChurch')}
                height={60}
                fontSize={18}
                fontWeight={600}
                onClick={onClickOpenChurch}
              />
            </ButtonContainer>
          ) : (
            <ButtonContainer>
              <Button
                borderRadius={10}
                text={t_button('createChurch')}
                columnPadding={20}
                height={60}
                fontSize={18}
                fontWeight={600}
                onClick={onClickCreateChurch}
              />
              <Button
                borderRadius={10}
                text={t_button('join')}
                columnPadding={20}
                height={60}
                fontSize={18}
                fontWeight={600}
                onClick={onClickJoin}
                backgroundColor={GREEN.DEFAULT}
              />
            </ButtonContainer>
          )
        ) : (
          <ButtonContainer>
            <Button
              borderRadius={10}
              text={t_button('startForFree')}
              height={60}
              fontSize={18}
              fontWeight={600}
              onClick={onClickStart}
            />
            <Button
              borderRadius={10}
              text={t_button('donate')}
              height={60}
              fontSize={18}
              fontWeight={600}
              onClick={onClickDonate}
              backgroundColor={GREEN.DEFAULT}
            />
          </ButtonContainer>
        )}
      </Content>
    </HeroContainer>
  );
};

export default HeroView;
