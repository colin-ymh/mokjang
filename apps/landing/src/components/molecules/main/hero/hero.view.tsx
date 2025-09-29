'use client';

import styled from 'styled-components';
import { useScopedI18n } from '../../../../../locales/client';
import { Button } from '@mokjang/components';
import { GREEN, LOCALE } from '@mokjang/constants';

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
                width={180}
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
                width={'auto'}
                columnPadding={20}
                height={60}
                fontSize={18}
                fontWeight={600}
                onClick={onClickCreateChurch}
              />
              <Button
                borderRadius={10}
                text={t_button('join')}
                width={'auto'}
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
              width={180}
              height={60}
              fontSize={18}
              fontWeight={600}
              onClick={onClickStart}
            />
            <Button
              borderRadius={10}
              text={t_button('donate')}
              width={180}
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
