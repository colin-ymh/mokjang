import { Church } from '@mokjang/models';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Button, LabelInput, MainText } from '@mokjang/components';
import { BLANK, LOCALE } from '@mokjang/constants';
import { usePathname } from 'next/navigation';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { useDenominationDropdownItems } from '@/hooks/dropdown/dropdown-items';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  padding: 20px;
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
  onChangeDenominationItem: (value: string) => void;
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
  onChangeDenominationItem,
  onClickSave,
}: EditChurchInformationViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');

  const denominationDropdownItems = useDenominationDropdownItems(locale);

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
        <LabelDropdown
          label={t('denomination')}
          value={targetChurch.denomination}
          customValue={targetChurch.denomination}
          items={denominationDropdownItems}
          onChangeItem={onChangeDenominationItem}
          onChangeCustomInput={onChangeDenomination}
          height={40}
          isCustom={true}
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
