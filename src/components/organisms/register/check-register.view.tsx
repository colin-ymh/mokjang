import React, { ChangeEvent, useRef } from 'react';
import styled from 'styled-components';

import LabelInput from '@/components/atoms/common/input/label-input';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN } from '@/constants/styles/color';
import { onClickEnter } from '@/utils/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SIZE } from '@/constants/styles/style';

import { useI18n, useScopedI18n } from '../../../../locales/client';

const CheckRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const HeaderTextContainer = styled.div`
  display: flex;
  padding: 30px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  gap: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 50px 30px 30px;
`;

type CheckRegisterViewProps = {
  isButtonEnable: boolean;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickButton: () => void;
};

const CheckRegisterView = ({
  isButtonEnable,
  onChangeName,
  onChangeMobilePhone,
  onClickButton,
}: CheckRegisterViewProps) => {
  const { member } = useSelector((state: RootState) => state.memberRegister);

  const t = useI18n();
  const t_register = useScopedI18n('register');
  const t_placeholder = useScopedI18n('placeholder');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);

  return (
    <CheckRegisterContainer>
      <HeaderTextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_register('checkRegisterPhrase')}
        </MainText>
      </HeaderTextContainer>
      <InputContainer>
        {/* 이름 */}
        <LabelInput
          enterKeyHint={'done'}
          ref={nameInputRef}
          label={t('name')}
          value={member.name}
          onChange={onChangeName}
          placeholder={t_placeholder('name')}
          onKeyDown={(event) => onClickEnter(event, mobilePhoneInputRef)}
        />
        {/* 휴대폰 번호 */}
        <LabelInput
          enterKeyHint={'done'}
          inputMode={'numeric'}
          ref={mobilePhoneInputRef}
          label={t('mobilePhone')}
          value={member.mobilePhone}
          onChange={onChangeMobilePhone}
          placeholder={t_placeholder('mobilePhone')}
        />
      </InputContainer>

      <ButtonContainer>
        <Button
          text={t_register('checkButton')}
          disabled={!isButtonEnable}
          backgroundColor={isButtonEnable ? MAIN.DEFAULT : GRAY.DEFAULT}
          onClick={onClickButton}
          height={40}
        />
      </ButtonContainer>
    </CheckRegisterContainer>
  );
};

export default CheckRegisterView;
