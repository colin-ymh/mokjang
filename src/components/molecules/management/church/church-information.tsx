import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { getFormattedMobilePhone } from '@/utils/format';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
`;

const ItemContainer = styled.div`
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
      <ItemContainer>
        <MainText fontWeight={600}>{t('churchName')}</MainText>
        <MainText>{church.name}</MainText>
      </ItemContainer>
      <ItemContainer>
        <MainText fontWeight={600}>{t('churchMainAdmin')}</MainText>
        <MainText>{}</MainText>
      </ItemContainer>
      <ItemContainer>
        <MainText fontWeight={600}>{t('churchPhone')}</MainText>
        <MainText>{getFormattedMobilePhone(church.phone)}</MainText>
      </ItemContainer>
      <ItemContainer>
        <MainText fontWeight={600}>{t('churchAddress')}</MainText>
        <MainText>{church.address}</MainText>
      </ItemContainer>
      <ItemContainer>
        <MainText fontWeight={600}>{t('detailAddress')}</MainText>
        <MainText>{church.detailAddress}</MainText>
      </ItemContainer>
      <ItemContainer>
        <MainText fontWeight={600}>{t('churchIdentifyNumber')}</MainText>
        <MainText>{church.identifyNumber}</MainText>
      </ItemContainer>
    </InformationContainer>
  );
};

export default ChurchInformation;
