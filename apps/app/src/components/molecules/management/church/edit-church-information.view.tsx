import { Church } from '@mokjang/models';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import {
  Button,
  LabelInput,
  MainText,
} from '../../../../../../../packages/components/src';
import { BLANK } from '../../../../../../../packages/constants/src';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  onClickSave?: () => void;
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
  onClickSave,
}: EditChurchInformationViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');

  return (
    <InformationContainer>
      <ListContainer>
        <MainText fontSize={20} fontWeight={700}>
          {t_register('churchInformation')}
        </MainText>
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
      </ListContainer>
      <ListContainer>
        <MainText fontSize={20} fontWeight={700}>
          {t_register('inChargeInformation')}
        </MainText>
        <LabelInput
          label={t('name')}
          value={''}
          onChange={() => {}}
          placeholder={t_placeholder('name')}
        />
        <LabelInput
          label={t('mobilePhone')}
          value={''}
          onChange={() => {}}
          placeholder={t_placeholder('mobilePhone')}
        />
        <LabelInput
          label={t('email')}
          value={''}
          onChange={() => {}}
          placeholder={t_placeholder('email')}
        />
      </ListContainer>

      {onClickSave && (
        <Button text={t_button('confirm')} height={40} onClick={onClickSave} />
      )}
    </InformationContainer>
  );
};

export default EditChurchInformationView;
