import { GRAY, LOCALE, MAIN } from '../../../../../packages/constants/src';
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
