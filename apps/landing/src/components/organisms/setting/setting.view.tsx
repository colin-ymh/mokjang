import { ChangeEvent } from 'react';
import styled from 'styled-components';

import {
  BorderInput,
  Button,
  MainText,
  ProfileImage,
} from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  getFormattedMobilePhone,
  getIsWellFormedMobilePhone,
  getMinuteFromSecond,
} from '@mokjang/utils';

const SettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 800px;
  gap: 30px;
  padding-top: 100px;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 600px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  padding: 20px;
  width: 560px;
  gap: 30px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const WithdrawContainer = styled.div`
  display: flex;
  width: 600px;
  justify-content: flex-end;
`;

export type SettingViewProp = {
  isEditName: boolean;
  isEditMobilePhone: boolean;
  isRequested: boolean;
  second: number;
  name: string;
  mobilePhone: string;
  inputCode: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeInputCode: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickEditName: () => void;
  onClickEditMobilePhone: () => void;
  onClickRequest: () => void;
  onClickCancelName: () => void;
  onClickCancelMobilePhone: () => void;
  onClickSaveName: () => void;
  onClickSaveMobilePhone: () => void;
  onClickWithdrawOpen: () => void;
};

const SettingView = ({
  isEditName,
  isEditMobilePhone,
  isRequested,
  second,
  name,
  mobilePhone,
  inputCode,
  onChangeName,
  onChangeMobilePhone,
  onChangeInputCode,
  onClickEditName,
  onClickEditMobilePhone,
  onClickRequest,
  onClickCancelName,
  onClickCancelMobilePhone,
  onClickSaveName,
  onClickSaveMobilePhone,
  onClickWithdrawOpen,
}: SettingViewProp) => {
  const { user } = useSelector((state: RootState) => state.user);

  const t = useI18n();
  const t_setting = useScopedI18n('setting');
  const t_button = useScopedI18n('button');

  const isRequestEnable = getIsWellFormedMobilePhone(mobilePhone);

  return (
    <>
      <SettingContainer>
        <HeaderContainer>
          <MainText fontSize={24} fontWeight={600}>
            {t_setting('title')}
          </MainText>
          <MainText fontSize={16} fontWeight={400}>
            {t_setting('description')}
          </MainText>
        </HeaderContainer>
        <CardContainer>
          <ProfileContainer>
            <ProfileImage
              value={user.churchUser[0]?.member?.profileImageUrl}
              width={50}
              height={50}
            />
            <ProfileDetail>
              <MainText fontSize={18} fontWeight={500}>
                {user.name}
              </MainText>
              <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
                {getFormattedMobilePhone(user.mobilePhone)}
              </MainText>
            </ProfileDetail>
          </ProfileContainer>

          <ColumnContainer>
            <MainText color={GRAY.DARK} fontSize={14} fontWeight={500}>
              {t('name')}
            </MainText>
            <RowContainer>
              {isEditName ? (
                <BorderInput value={name} onChange={onChangeName} height={40} />
              ) : (
                <MainText fontSize={16}>{name}</MainText>
              )}
              {!isEditName && (
                <Button
                  text={t_button('edit')}
                  width={60}
                  height={40}
                  color={GRAY.DARK}
                  backgroundColor={GRAY.EXTRA_LIGHT}
                  onClick={onClickEditName}
                />
              )}
              {isEditName && (
                <Button
                  text={t_button('cancel')}
                  width={60}
                  height={40}
                  color={GRAY.DARK}
                  backgroundColor={GRAY.EXTRA_LIGHT}
                  onClick={onClickCancelName}
                />
              )}
              {isEditName && (
                <Button
                  text={t_button('save')}
                  width={60}
                  height={40}
                  onClick={onClickSaveName}
                />
              )}
            </RowContainer>
          </ColumnContainer>

          <ColumnContainer>
            <MainText color={GRAY.DARK} fontSize={14} fontWeight={500}>
              {t('mobilePhone')}
            </MainText>
            <RowContainer>
              {isEditMobilePhone ? (
                <BorderInput
                  value={mobilePhone}
                  onChange={onChangeMobilePhone}
                  height={40}
                />
              ) : (
                <MainText fontSize={16}>{mobilePhone}</MainText>
              )}
              {!isEditMobilePhone && (
                <Button
                  text={t_button('edit')}
                  width={60}
                  height={40}
                  color={GRAY.DARK}
                  backgroundColor={GRAY.EXTRA_LIGHT}
                  onClick={onClickEditMobilePhone}
                />
              )}
              {isEditMobilePhone && (
                <Button
                  text={t_button('cancel')}
                  width={60}
                  height={40}
                  color={GRAY.DARK}
                  backgroundColor={GRAY.EXTRA_LIGHT}
                  onClick={onClickCancelMobilePhone}
                />
              )}
              {isEditMobilePhone && (
                <Button
                  text={t_button(
                    isRequested
                      ? 'mobilePhone.reRequest'
                      : 'mobilePhone.request'
                  )}
                  width={60}
                  height={40}
                  onClick={onClickRequest}
                  disabled={!isRequestEnable}
                  backgroundColor={
                    isRequestEnable ? MAIN.DEFAULT : GRAY.DEFAULT
                  }
                />
              )}
            </RowContainer>
            {isRequested && (
              <RowContainer>
                <BorderInput
                  value={inputCode}
                  onChange={onChangeInputCode}
                  height={40}
                />
                <Button
                  text={t_button('mobilePhone.verify')}
                  width={60}
                  height={40}
                  onClick={onClickSaveMobilePhone}
                  disabled={inputCode.length === 0}
                  backgroundColor={
                    inputCode.length !== 0 ? MAIN.DEFAULT : GRAY.DEFAULT
                  }
                />
              </RowContainer>
            )}
            {isRequested && (
              <RowContainer>
                <MainText color={MAIN.DEFAULT} fontSize={12}>
                  {getMinuteFromSecond(second)}
                </MainText>
              </RowContainer>
            )}
          </ColumnContainer>
        </CardContainer>
        <WithdrawContainer>
          <MainText
            color={GRAY.SEMI_LIGHT}
            fontSize={14}
            fontWeight={400}
            textDecoration={'underline'}
            onClick={onClickWithdrawOpen}
          >
            {t_button('withdraw')}
          </MainText>
        </WithdrawContainer>
      </SettingContainer>
    </>
  );
};

export default SettingView;
