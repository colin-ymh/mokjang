import styled from 'styled-components';
import { Button, LabelInput, MainText } from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import {
  BLACK,
  BLANK,
  DESTRUCTIVE,
  GRAY,
  MAIN,
  RED,
  SIZE,
  WHITE,
} from '@mokjang/constants';
import { ChangeEvent, useEffect, useState } from 'react';
import { getMinuteFromSecond, routeLandingPage } from '@mokjang/utils';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { ChurchesApi } from '@/api/churches/churches.api';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

const DeleteChurchContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  gap: 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const DeleteChurch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchesApi = new ChurchesApi(false);
  const t = useI18n();
  const t_description = useScopedI18n('description');
  const t_button = useScopedI18n('button');
  const t_placeholder = useScopedI18n('placeholder');

  const { churchId } = useSelector((state: RootState) => state.church);

  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [second, setSecond] = useState<number>(0);

  const [verifyNumber, setVerifyNumber] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeVerifyNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyNumber(event.target.value);
  };

  const onClickRequest = async () => {
    try {
      await churchesApi
        .requestDelete(
          { churchId },
          {
            isTest: true,
          }
        )
        .then((response) => {
          console.log(response);
        });

      setIsRequested(true);
      setSecond(300);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickConfirmDelete = async () => {
    try {
      await churchesApi.confirmDelete(
        { churchId },
        {
          inputCode: verifyNumber,
        }
      );

      routeLandingPage('/');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 타이머 감소 로직
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRequested && second > 0) {
      timer = setInterval(() => {
        setSecond((prevSecond) => prevSecond - 1);
      }, 1000);
    }
    if (second === 0 && isRequested) {
      setIsRequested(false);
    }
    return () => clearInterval(timer);
  }, [isRequested, second]);

  return (
    <DeleteChurchContainer>
      <LabelContainer>
        <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
          {t_description('deleteChurchRequest')}
        </MainText>
        <Button
          height={40}
          backgroundColor={isRequested ? GRAY.DEFAULT : WHITE}
          color={isRequested ? WHITE : BLACK}
          borderColor={isRequested ? GRAY.DEFAULT : GRAY.LIGHT}
          text={t_button('deleteChurchVerify')}
          disabled={isRequested}
          onClick={onClickRequest}
        />
      </LabelContainer>

      {isRequested && (
        <LabelInput
          label={t('verifyNumber')}
          value={verifyNumber}
          onChange={onChangeVerifyNumber}
          placeholder={t_placeholder('verifyNumber')}
        />
      )}
      {isRequested && (
        <RowContainer>
          <MainText color={MAIN.DEFAULT} fontSize={12}>
            {getMinuteFromSecond(second)}
          </MainText>
        </RowContainer>
      )}

      {isRequested && (
        <Button
          height={40}
          backgroundColor={verifyNumber.length !== 6 ? GRAY.LIGHT : RED.DEFAULT}
          color={WHITE}
          borderColor={verifyNumber.length !== 6 ? GRAY.LIGHT : RED.DEFAULT}
          text={t_button('verifyAndDelete')}
          disabled={verifyNumber.length !== 6}
          onClick={onClickConfirmDelete}
        />
      )}
    </DeleteChurchContainer>
  );
};

export default DeleteChurch;
