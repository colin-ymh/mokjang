import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MEMBER_REGISTER_STAGE } from '@/constants/constant';
import { MainText } from '@/components/atoms/common/text/main-text';
import PersonalRegister from '@/components/molecules/register/personal-register';
import ReligiousRegister from '@/components/molecules/register/religious-register';
import ExtraButtonList from '@/components/molecules/register/extra-button-list';

import { useScopedI18n } from '../../../../locales/client';
import { SIZE } from '@/constants/styles/style';

const RegisterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
`;

const TextContainer = styled.div`
    padding: 30px;
`;

const ContentContainer = styled.div`
    flex: 1;
    overflow-y: scroll;
    width: 100%;`

type ExtraMemberRegisterViewProps = {};

const ExtraMemberRegisterView = ({}: ExtraMemberRegisterViewProps) => {
  const { stage } = useSelector((state: RootState) => state.memberRegister);

  const t_register = useScopedI18n('register');

  return (
    <RegisterContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_register('extraHeaderPhrase')}
        </MainText>
      </TextContainer>
      <ContentContainer>
      {stage === MEMBER_REGISTER_STAGE.PERSONAL && <PersonalRegister />}
      {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && <ReligiousRegister />}
      </ContentContainer>
      <ExtraButtonList />
    </RegisterContainer>
  );
};

export default ExtraMemberRegisterView;
