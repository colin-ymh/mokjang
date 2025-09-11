import styled from 'styled-components';

import {
  Button,
  LabelInput,
  LabelTextarea,
  MainText,
} from '@mokjang/components';
import { GRAY, LOCALE, WHITE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { usePathname } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useDenominationDropdownItems } from '@/hooks/dropdown/dropdown-items';
import LabelDropdown from '@/components/atoms/dropdown/label-dropdown';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 800px;
  gap: 50px;
  padding-top: 100px;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 550px;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding-top: 30px;
`;

export type ContactViewProps = {
  isEnabled: boolean;
  churchName: string;
  denomination: string;
  name: string;
  mobilePhone: string;
  email: string;
  description: string;
  onChangeChurchName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDenomination: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDenominationItem: (value: string) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEmail: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickSendContact: () => void;
};

const ContactView = ({
  isEnabled,
  churchName,
  denomination,
  name,
  mobilePhone,
  email,
  description,
  onChangeChurchName,
  onChangeDenomination,
  onChangeDenominationItem,
  onChangeName,
  onChangeEmail,
  onChangeMobilePhone,
  onChangeDescription,
  onClickSendContact,
}: ContactViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_contact = useScopedI18n('contact');
  const t_button = useScopedI18n('button');
  const t_placeholder = useScopedI18n('placeholder');

  const denominationDropdownItems = useDenominationDropdownItems(locale);

  return (
    <ListContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700}>
          {t_contact('title')}
        </MainText>
        <MainText fontSize={20} fontWeight={400} color={GRAY.DARK}>
          {t_contact('description')}
        </MainText>
      </HeaderContainer>
      <FormContainer>
        <MainText fontSize={24} fontWeight={700}>
          {t_contact('contactForm')}
        </MainText>
        <RowContainer>
          <LabelInput
            height={40}
            label={t('churchName')}
            value={churchName}
            onChange={onChangeChurchName}
            placeholder={t_placeholder('churchName')}
            isRequired
          />
          <LabelDropdown
            label={t('denomination')}
            value={denomination}
            customValue={denomination}
            items={denominationDropdownItems}
            onChangeItem={onChangeDenominationItem}
            onChangeCustomInput={onChangeDenomination}
            height={40}
            isCustom={true}
            placeholder={t_placeholder('denomination')}
          />
        </RowContainer>
        <RowContainer>
          <LabelInput
            height={40}
            label={t('name')}
            value={name}
            onChange={onChangeName}
            placeholder={t_placeholder('name')}
            isRequired
          />
          <LabelInput
            height={40}
            label={t('mobilePhone')}
            value={mobilePhone}
            onChange={onChangeMobilePhone}
            placeholder={t_placeholder('mobilePhone')}
            isRequired
          />
        </RowContainer>
        <LabelInput
          height={40}
          label={t('email')}
          value={email}
          onChange={onChangeEmail}
          placeholder={t_placeholder('email')}
          isRequired
        />
        <LabelTextarea
          label={t_contact('contactContent')}
          value={description}
          onChange={onChangeDescription}
          maxLength={500}
          height={100}
          placeholder={t_placeholder('contactContent')}
        />
        <ButtonContainer>
          <Button
            text={t_button('contact')}
            width={550}
            height={50}
            fontSize={16}
            fontWeight={600}
            onClick={onClickSendContact}
          />
        </ButtonContainer>
      </FormContainer>
    </ListContainer>
  );
};

export default ContactView;
