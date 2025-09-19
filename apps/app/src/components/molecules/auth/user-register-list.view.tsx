import { ChangeEvent } from 'react';
import styled from 'styled-components';

import { Button, LabelInput, MainText } from '@mokjang/components';
import { BLACK, GRAY, MAIN, MEMBER } from '@mokjang/constants';
import {
  getIsWellFormedName,
  getIsWellFormedPhone,
  getMinuteFromSecond,
} from '@mokjang/utils';

import { useI18n, useScopedI18n } from '../../../../locales/client';
import { Svg } from '@mokjang/assets';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 40px;
`;

const RowContainer = styled.div<{ $isShown?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;

  /* 트랜지션 효과 */
  transition: opacity 0.2s ease;

  /* display: none 대신, opacity와 pointer-events로 show/hide */
  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  pointer-events: ${({ $isShown }) => ($isShown ? 'auto' : 'none')};
`;

const TimeContainer = styled.div<{ $isShown?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding-left: 10px;

  /* 트랜지션 효과 */
  transition: opacity 0.2s ease;

  /* display: none 대신, opacity와 pointer-events로 show/hide */
  opacity: ${({ $isShown }) => ($isShown ? 1 : 0)};
  pointer-events: ${({ $isShown }) => ($isShown ? 'auto' : 'none')};
`;

const ConsentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const CheckButton = styled(Svg.Check)<{ $isChecked: boolean }>`
  cursor: pointer;
  width: 25px;
  height: 25px;
  stroke-width: 3px;
  transition: stroke 0.2s ease-in-out;
  stroke: ${({ $isChecked }) => ($isChecked ? MAIN.DEFAULT : GRAY.SEMI_LIGHT)};
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
  isConsent: boolean;
  onChangeName: (name: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (mobilePhone: ChangeEvent<HTMLInputElement>) => void;
  onChangeVerifyNumber: (mobilePhone: ChangeEvent<HTMLInputElement>) => void;
  onClickRequest: () => void;
  onClickVerify: () => void;
  onClickConsent: () => void;
  onClickDone: () => void;
  onClickLogOut: () => void;
};

const UserRegisterListView = ({
  name,
  mobilePhone,
  verifyNumber,
  second,
  isRequested,
  isVerified,
  isConsent,
  onChangeName,
  onChangeMobilePhone,
  onChangeVerifyNumber,
  onClickRequest,
  onClickVerify,
  onClickConsent,
  onClickDone,
  onClickLogOut,
}: UserRegisterListViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');

  return (
    <ListContainer>
      <InputContainer>
        <LabelInput
          value={name}
          label={t(MEMBER.NAME)}
          height={40}
          onChange={onChangeName}
          disabled={isVerified}
        />
        <RowContainer $isShown={true}>
          <LabelInput
            value={mobilePhone}
            label={t(MEMBER.MOBILE_PHONE)}
            height={40}
            onChange={onChangeMobilePhone}
            disabled={isVerified}
          />
          <Button
            text={t_button('request')}
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
        <RowContainer $isShown={!!second}>
          <LabelInput
            value={verifyNumber}
            label={`${t('verifyNumber')} (관리자 나천호에게 연락 부탁드립니다)`}
            height={40}
            onChange={onChangeVerifyNumber}
            disabled={isVerified}
          />
          <Button
            text={t_button('verify')}
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
          <MainText>{getMinuteFromSecond(second)}</MainText>
        </TimeContainer>
        <ConsentContainer>
          <MainText fontSize={12} color={MAIN.DEFAULT}>
            개인정보 수집 및 이용 동의
          </MainText>
          <CheckButton $isChecked={isConsent} onClick={onClickConsent} />
        </ConsentContainer>
      </InputContainer>
      <ButtonContainer>
        <Button
          text={t_button('signIn')}
          height={40}
          backgroundColor={
            isVerified && isConsent ? MAIN.DEFAULT : GRAY.SEMI_LIGHT
          }
          disabled={!(isVerified && isConsent)}
          onClick={onClickDone}
        />
        <Button
          text={t_button('logOut')}
          height={40}
          backgroundColor={BLACK}
          onClick={onClickLogOut}
        />
      </ButtonContainer>
    </ListContainer>
  );
};

export default UserRegisterListView;
