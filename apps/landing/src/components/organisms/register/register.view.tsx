import { ChangeEvent } from 'react';
import styled from 'styled-components';

import {
  BorderInput,
  Button,
  CheckButton,
  LabelInput,
  MainText,
} from '@mokjang/components';
import { CURSOR, GRAY, GREEN, LOCALE, MAIN, WHITE } from '@mokjang/constants';
import {
  getIsWellFormedName,
  getIsWellFormedPhone,
  getMinuteFromSecond,
  getTranslatedVerifyNumber,
} from '@mokjang/utils';

import { useI18n, useScopedI18n } from '../../../../locales/client';
import { usePathname } from 'next/navigation';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 800px;
  gap: 50px;
  flex-shrink: 0;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ConsentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RowContainer = styled.div<{ $isShown?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
  width: 400px;

  /* 트랜지션 효과 */
  transition: opacity 0.2s ease;

  /* display: none 대신, opacity와 pointer-events로 show/hide */
  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  pointer-events: ${({ $isShown }) => ($isShown ? 'auto' : 'none')};
`;

const TimeContainer = styled.div<{ $isShown?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  /* 트랜지션 효과 */
  transition: opacity 0.2s ease;

  /* display: none 대신, opacity와 pointer-events로 show/hide */
  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  pointer-events: ${({ $isShown }) => ($isShown ? 'auto' : 'none')};
`;

const ConsentItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 10px;
  background-color: ${GRAY.SUPER_LIGHT};
  padding: 20px;
  width: 360px;
`;

const ConsentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 40px;
  gap: 10px;
`;

type UserRegisterListViewProps = {
  name: string;
  mobilePhone: string;
  verifyNumber: string;
  second: number;
  isRequested: boolean;
  isVerified: boolean;
  isCollectionConsent: boolean;
  isThirdConsent: boolean;
  onChangeName: (name: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (mobilePhone: ChangeEvent<HTMLInputElement>) => void;
  onChangeVerifyNumber: (mobilePhone: ChangeEvent<HTMLInputElement>) => void;
  onClickRequest: () => void;
  onClickVerify: () => void;
  onClickCollectionConsent: () => void;
  onClickThirdConsent: () => void;
  onClickDone: () => void;
  onClickCollectionLink: () => void;
  onClickThirdLink: () => void;
};

const RegisterView = ({
  name,
  mobilePhone,
  verifyNumber,
  second,
  isRequested,
  isVerified,
  isCollectionConsent,
  isThirdConsent,
  onChangeName,
  onChangeMobilePhone,
  onChangeVerifyNumber,
  onClickRequest,
  onClickVerify,
  onClickCollectionConsent,
  onClickThirdConsent,
  onClickDone,
  onClickCollectionLink,
  onClickThirdLink,
}: UserRegisterListViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_register = useScopedI18n('register');
  const t_collection = useScopedI18n('register.consent.collection');
  const t_third = useScopedI18n('register.consent.thirdParty');

  return (
    <ListContainer>
      {/* 헤더 */}
      <HeaderContainer>
        <MainText fontSize={24} fontWeight={700}>
          {t_register('title')}
        </MainText>
        <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
          {t_register('description')}
        </MainText>
      </HeaderContainer>
      {/* 컨텐츠 */}
      <ContentContainer>
        <InputContainer>
          {/* 이름 */}
          <LabelInput
            value={name}
            label={t('name')}
            height={40}
            onChange={onChangeName}
            disabled={isVerified}
          />
          <VerifyContainer>
            {/* 전화번호 */}
            <RowContainer $isShown={true}>
              <LabelInput
                value={mobilePhone}
                label={t('mobilePhone')}
                height={40}
                onChange={onChangeMobilePhone}
                disabled={isVerified}
              />
              <Button
                text={isRequested ? t_button('reRequest') : t_button('request')}
                height={40}
                width={70}
                onClick={onClickRequest}
                backgroundColor={
                  !isVerified &&
                  getIsWellFormedName(name) &&
                  getIsWellFormedPhone(mobilePhone)
                    ? MAIN.DEFAULT
                    : GRAY.SEMI_LIGHT
                }
                disabled={
                  !(
                    !isVerified &&
                    getIsWellFormedName(name) &&
                    getIsWellFormedPhone(mobilePhone)
                  )
                }
              />
            </RowContainer>
            {/* 인증번호 */}
            <RowContainer $isShown={!!second}>
              <BorderInput
                value={verifyNumber}
                height={40}
                onChange={onChangeVerifyNumber}
                disabled={isVerified}
              />
              <Button
                text={t_button('confirm')}
                height={40}
                width={70}
                backgroundColor={
                  !isVerified && isRequested && verifyNumber.length === 6
                    ? MAIN.DEFAULT
                    : GRAY.SEMI_LIGHT
                }
                disabled={
                  !(!isVerified && isRequested && verifyNumber.length === 6)
                }
                onClick={onClickVerify}
              />
            </RowContainer>
            <TimeContainer $isShown={!!second}>
              {isVerified && (
                <MainText color={GREEN.DEFAULT} fontSize={12}>
                  {t_register('verifyComplete')}
                </MainText>
              )}
              {!isVerified && isRequested && (
                <MainText color={GRAY.DARK} fontSize={12}>
                  {getTranslatedVerifyNumber(locale, mobilePhone)}
                </MainText>
              )}
              {!isVerified && isRequested && (
                <MainText color={MAIN.DEFAULT} fontSize={12}>
                  {getMinuteFromSecond(second)}
                </MainText>
              )}
            </TimeContainer>
          </VerifyContainer>
        </InputContainer>
        <ConsentContainer>
          <ConsentItemContainer>
            <CheckButton
              value={isCollectionConsent}
              onChange={onClickCollectionConsent}
            />
            <ConsentColumn>
              <MainText
                fontWeight={500}
                onClick={onClickCollectionLink}
                textDecoration={'underline'}
                color={'blue'}
                cursor={CURSOR.POINTER}
              >
                {t_collection('title')}
              </MainText>
            </ConsentColumn>
          </ConsentItemContainer>
          {/*<ConsentItemContainer>*/}
          {/*  <CheckButton*/}
          {/*    value={isThirdConsent}*/}
          {/*    onChange={onClickThirdConsent}*/}
          {/*  />*/}
          {/*  <ConsentColumn>*/}
          {/*    <MainText*/}
          {/*      fontWeight={500}*/}
          {/*      onClick={onClickThirdLink}*/}
          {/*      textDecoration={'underline'}*/}
          {/*      color={'blue'}*/}
          {/*      cursor={CURSOR.POINTER}*/}
          {/*    >*/}
          {/*      {t_third('title')}*/}
          {/*    </MainText>*/}
          {/*  </ConsentColumn>*/}
          {/*</ConsentItemContainer>*/}
        </ConsentContainer>
        <ButtonContainer>
          <Button
            text={t_button('registerDone')}
            height={40}
            width={400}
            backgroundColor={
              isVerified && isCollectionConsent ? MAIN.DEFAULT : GRAY.SEMI_LIGHT
            }
            disabled={!(isVerified && isCollectionConsent)}
            onClick={onClickDone}
          />
        </ButtonContainer>
      </ContentContainer>
    </ListContainer>
  );
};

export default RegisterView;
