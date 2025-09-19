import {
  GRAY,
  GREEN,
  LOCALE,
  MAIN,
  WHITE,
} from '../../../../../packages/constants/src';
import { MainText } from '../../../../../packages/components/src';
import styled from 'styled-components';

const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const getTranslatedMonthlySubscriptionPriceComponent = (
  basePath: LOCALE,
  price: number
) => {
  const formattedPrice = price.toLocaleString();

  if (basePath === LOCALE.EN) {
    return (
      <PriceContainer>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'￦'}
        </MainText>
        <MainText fontSize={30} fontWeight={700} color={MAIN.DEFAULT}>
          {formattedPrice}
        </MainText>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'per month'}
        </MainText>
      </PriceContainer>
    );
  } else {
    return (
      <PriceContainer>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'월'}
        </MainText>
        <MainText fontSize={30} fontWeight={700} color={MAIN.DEFAULT}>
          {formattedPrice}
        </MainText>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'원'}
        </MainText>
      </PriceContainer>
    );
  }
};

export const getTranslatedYearlySubscriptionPriceComponent = (
  basePath: LOCALE,
  price: number
) => {
  const formattedPrice = price.toLocaleString();

  if (basePath === LOCALE.EN) {
    return (
      <PriceContainer>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'￦'}
        </MainText>
        <MainText fontSize={30} fontWeight={700} color={MAIN.DEFAULT}>
          {formattedPrice}
        </MainText>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'per year'}
        </MainText>
      </PriceContainer>
    );
  } else {
    return (
      <PriceContainer>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'연'}
        </MainText>
        <MainText fontSize={30} fontWeight={700} color={MAIN.DEFAULT}>
          {formattedPrice}
        </MainText>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {'원'}
        </MainText>
      </PriceContainer>
    );
  }
};

export const getTranslatedHeroTitle = (basePath: LOCALE) => {
  if (basePath === LOCALE.EN) {
    return (
      <MainText fontSize={60} fontWeight={700} color={WHITE}>
        {'A New Beginning for Church Management'}
      </MainText>
    );
  } else {
    return (
      <MainText fontSize={60} fontWeight={700} color={WHITE}>
        {'교회 관리의 새로운 시작'}
      </MainText>
    );
  }
};

export const getTranslatedHeroDescription = (basePath: LOCALE) => {
  if (basePath === LOCALE.EN) {
    return (
      <MainText fontSize={20} color={GRAY.LIGHT}>
        Manage all church tasks from membership records to attendance in one
        platform,{' '}
        <MainText fontSize={22} fontWeight={600} color={GREEN.DEFAULT}>
          completely free
        </MainText>
      </MainText>
    );
  } else {
    return (
      <MainText fontSize={20} color={GRAY.LIGHT}>
        교적부부터 출석관리까지 모든 교회 업무를 하나의 플랫폼에서{' '}
        <MainText fontSize={22} fontWeight={600} color={GREEN.DEFAULT}>
          완전 무료로{' '}
        </MainText>
        관리하세요
      </MainText>
    );
  }
};
