import { Church } from '@/models/church/church';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import LabelInput from '@/components/atoms/common/input/label-input';
import { BLANK } from '@/constants/constant';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
  width: 100%;
`;

type EditChurchInformationViewProps = {
  targetChurch: Church;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangePastorName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickAddress: () => void;
  onChangeDetailAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeIdentifyNumber: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDenomination: (event: ChangeEvent<HTMLInputElement>) => void;
};

const EditChurchInformationView = ({
  targetChurch,
  onChangeName,
  onChangePhone,
  onChangePastorName,
  onClickAddress,
  onChangeDetailAddress,
  onChangeIdentifyNumber,
  onChangeDenomination,
}: EditChurchInformationViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  return (
    <InformationContainer>
      <LabelInput
        label={t('churchName')}
        value={targetChurch.name}
        onChange={onChangeName}
        placeholder={t_placeholder('churchName')}
      />
      <LabelInput
        label={t('churchPhone')}
        value={targetChurch.phone}
        onChange={onChangePhone}
        placeholder={t_placeholder('churchPhone')}
      />
      <LabelInput
        label={t('pastor')}
        value={targetChurch.pastor}
        onChange={onChangePastorName}
        placeholder={t_placeholder('pastor')}
      />
      <LabelInput
        label={t('churchAddress')}
        value={targetChurch.address || BLANK}
        placeholder={t_placeholder('churchAddress')}
        onClick={onClickAddress}
        onChange={() => {}}
      />
      <LabelInput
        label={t('detailAddress')}
        value={targetChurch.detailAddress}
        onChange={onChangeDetailAddress}
        placeholder={t_placeholder('detailAddress')}
      />
      <LabelInput
        label={t('churchIdentifyNumber')}
        value={targetChurch.identifyNumber}
        onChange={onChangeIdentifyNumber}
        placeholder={t_placeholder('churchIdentifyNumber')}
      />
      <LabelInput
        label={t('denomination')}
        value={targetChurch.denomination}
        onChange={onChangeDenomination}
        placeholder={t_placeholder('denomination')}
      />
    </InformationContainer>
  );
};

export default EditChurchInformationView;
