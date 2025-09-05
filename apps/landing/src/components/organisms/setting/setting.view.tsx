import { ChangeEvent } from 'react';
import styled from 'styled-components';

import {
  BorderInput,
  Button,
  LabelInput,
  MainText,
  ProfileImage,
} from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { GRAY, WHITE } from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFormattedMobilePhone } from '@mokjang/utils';

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
  name: string;
  mobilePhone: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickEditName: () => void;
  onClickEditMobilePhone: () => void;
  onClickCancelName: () => void;
  onClickCancelMobilePhone: () => void;
  onClickSaveName: () => void;
  onClickSaveMobilePhone: () => void;
};

const SettingView = ({
  isEditName,
  isEditMobilePhone,
  name,
  mobilePhone,
  onChangeName,
  onChangeMobilePhone,
  onClickEditName,
  onClickEditMobilePhone,
  onClickCancelName,
  onClickCancelMobilePhone,
  onClickSaveName,
  onClickSaveMobilePhone,
}: SettingViewProp) => {
  const { user } = useSelector((state: RootState) => state.user);

  const t = useI18n();
  const t_setting = useScopedI18n('setting');
  const t_button = useScopedI18n('button');

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
                <BorderInput
                  label={t('name')}
                  value={name}
                  onChange={onChangeName}
                  height={40}
                />
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
                  label={t('mobilePhone')}
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
                  text={t_button('save')}
                  width={60}
                  height={40}
                  onClick={onClickSaveMobilePhone}
                />
              )}
            </RowContainer>
          </ColumnContainer>
        </CardContainer>
        <WithdrawContainer>
          <MainText
            color={GRAY.SEMI_LIGHT}
            fontSize={14}
            fontWeight={400}
            textDecoration={'underline'}
          >
            {t_button('withdraw')}
          </MainText>
        </WithdrawContainer>
      </SettingContainer>
    </>
  );
};

export default SettingView;
