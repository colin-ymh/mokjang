import styled from 'styled-components';

import { AUTH } from '@/api/auth/auth.api';

import { MainText } from '@mokjang/components';
import { BLACK, GRAY, LOCALE, MEDIA_MAX_WIDTH, WHITE, } from '@mokjang/constants';
import { useScopedI18n } from '../../../../locales/client';
import {
  getGoogleLoginText,
  getKakaoLoginText,
  getNaverLoginText,
  GOOGLE_BACKGROUND_COLOR,
  GOOGLE_BORDER_COLOR,
  GOOGLE_BORDER_OPACITY,
  KAKAO_BACKGROUND_COLOR,
  KAKAO_BORDER_COLOR,
  KAKAO_BORDER_OPACITY,
  KAKAO_BORDER_RADIUS,
  NAVER_BACKGROUND_COLOR,
} from '@/constants/auth';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import Kakao from '../../../../public/png/kakao-logo.png';
import Naver from '../../../../public/png/naver-logo.png';
import Google from '../../../../public/png/google-logo.png';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 800px;
  gap: 50px;
  background-color: ${WHITE};

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    height: 600px;
    width: 100%;
  }
`;

const OAuthList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    width: 100%;
  }
`;

const OAuthItem = styled.div<{
  $borderColor?: string;
  $backgroundColor?: string;
  $borderRadius?: number;
  $borderOpacity?: number;
}>`
  cursor: pointer;
  display: flex;
  height: 50px;
  width: 400px;
  padding: 0 20px;

  justify-content: center;
  align-items: center;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: ${({ $borderRadius }) => $borderRadius || 12}px;
  border: ${({ $borderColor, $borderOpacity }) =>
    $borderColor
      ? `1px solid rgba(${parseInt($borderColor.slice(1, 3), 16)}, ${parseInt(
          $borderColor.slice(3, 5),
          16
        )}, ${parseInt($borderColor.slice(5, 7), 16)}, ${$borderOpacity ?? 1})`
      : 'none'};

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    width: auto;
    margin: 0 20px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span<{ $fontSize: number; color?: string }>`
  font-size: ${({ $fontSize }) => $fontSize}px;
  color: ${({ color }) => color || 'black'};
`;

type LoginListViewProps = {
  onClickItem: (provider?: AUTH) => void;
};

const LoginListView = ({ onClickItem }: LoginListViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t_login = useScopedI18n('login');

  return (
    <ListContainer>
      <MainText fontSize={24} fontWeight={700}>
        {t_login('title')}
      </MainText>
      <OAuthList>
        {/* 카카오 */}
        <OAuthItem
          onClick={() => onClickItem(AUTH.KAKAO)}
          $backgroundColor={KAKAO_BACKGROUND_COLOR}
          $borderColor={KAKAO_BORDER_COLOR}
          $borderOpacity={KAKAO_BORDER_OPACITY}
          $borderRadius={KAKAO_BORDER_RADIUS}
        >
          <Image src={Kakao} alt={'kakao'} width={18} height={18} />
          <TitleContainer>
            <Title $fontSize={18}>{getKakaoLoginText(locale)}</Title>
          </TitleContainer>
        </OAuthItem>
        {/* 네이버 */}
        <OAuthItem
          onClick={() => onClickItem(AUTH.NAVER)}
          $backgroundColor={NAVER_BACKGROUND_COLOR}
        >
          <Image src={Naver} alt={'naver'} width={18} height={18} />
          <TitleContainer>
            <Title $fontSize={18} color={WHITE}>
              {getNaverLoginText(locale)}
            </Title>
          </TitleContainer>
        </OAuthItem>
        {/* 구글 */}
        <OAuthItem
          onClick={() => onClickItem(AUTH.GOOGLE)}
          $backgroundColor={GOOGLE_BACKGROUND_COLOR}
          $borderColor={GOOGLE_BORDER_COLOR}
          $borderOpacity={GOOGLE_BORDER_OPACITY}
        >
          <Image src={Google} alt={'google'} width={18} height={18} />
          <TitleContainer>
            <Title $fontSize={18} color={BLACK}>
              {getGoogleLoginText(locale)}
            </Title>
          </TitleContainer>
        </OAuthItem>
      </OAuthList>
      <div></div>
      <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
        {t_login('description')}
      </MainText>
    </ListContainer>
  );
};

export default LoginListView;
