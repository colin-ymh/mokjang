import styled from 'styled-components';
import { MainText } from '../../../atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { GRAY } from '../../../../constants/styles/color';
import { SIZE } from '../../../../constants/styles/style';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type ChurchInformationProps = {};

const ChurchInformation = ({}: ChurchInformationProps) => {
  const { church } = useSelector((state: RootState) => state.church);
  const t = useI18n();
  return (
    <InformationContainer>
      <RowContainer>
        <ItemContainer>
          <MainText color={GRAY.SEMI_DARK}>{t('churchName')}</MainText>
          <MainText size={SIZE.EXTRA_LARGE}>{church.name}</MainText>
        </ItemContainer>
        <ItemContainer>
          <MainText color={GRAY.SEMI_DARK}>{t('pastor')}</MainText>
          <MainText size={SIZE.EXTRA_LARGE}>{}</MainText>
        </ItemContainer>
      </RowContainer>
      <RowContainer>
        <ItemContainer>
          <MainText color={GRAY.SEMI_DARK}>{t('churchPhone')}</MainText>
          <MainText>{church.phone}</MainText>
        </ItemContainer>
        <ItemContainer>
          <MainText color={GRAY.SEMI_DARK}>{t('churchAddress')}</MainText>
          <MainText>{church.address}</MainText>
        </ItemContainer>
      </RowContainer>
      <RowContainer>
        <ItemContainer>
          <MainText color={GRAY.SEMI_DARK}>
            {t('churchIdentifyNumber')}
          </MainText>
          <MainText>{church.identifyNumber}</MainText>
        </ItemContainer>
        <ItemContainer>
          <MainText color={GRAY.SEMI_DARK}>{t('denomination')}</MainText>
          <MainText>{church.denomination}</MainText>
        </ItemContainer>
      </RowContainer>
    </InformationContainer>
  );
};

export default ChurchInformation;
