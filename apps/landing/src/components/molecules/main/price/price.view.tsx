import styled from 'styled-components';
import { MainText } from '../../../../../../../packages/components/src';
import { GRAY } from '../../../../../../../packages/constants/src';
import { PlanList } from '@/models/subscription/subscription';
import PriceItem from '@/components/atoms/main/price/price-item';
import { useScopedI18n } from '../../../../../locales/client';

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 900px;
  justify-content: center;
  align-items: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;

const PriceList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding: 100px 0 50px 0;
`;

export type PriceViewProps = {
  backgroundUrl?: string;
  title?: string;
  description?: string;
};

const PriceView = ({}: PriceViewProps) => {
  const t_main = useScopedI18n('main.price');

  return (
    <PriceContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700}>
          {t_main('title')}
        </MainText>
        <MainText fontSize={20} color={GRAY.DARK}>
          {t_main('description')}
        </MainText>
      </HeaderContainer>
      <PriceList>
        {PlanList.map((item) => (
          <PriceItem key={item.id} item={item} />
        ))}
      </PriceList>
      <MainText fontSize={16} color={GRAY.DARK}>
        {t_main('extra')}
      </MainText>
    </PriceContainer>
  );
};

export default PriceView;
