'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { setUser } from '../../../redux/reducers/user-reducer';

import { AuthApi, IS_TEST } from '../../../api/auth/auth.api';
import UserRegisterListView from './user-register-list.view';
import { Loading } from '@mokjang/components';
import {
  getFormattedName,
  getFormattedPhone,
  usePageRouter,
} from '@mokjang/utils';

import { useScopedI18n } from '../../../../locales/client';
import { UserApi } from '../../../api/user/user.api';
import { setIsToastShown } from '../../../redux/reducers/toast-popup-reducer';

const UserRegisterList = () => {
  const t_popup = useScopedI18n('popup');
  const router = usePageRouter();
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  const dispatch = useDispatch<AppDispatch>();

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 인증 시간 타이머
  const [second, setSecond] = useState<number>(0);

  // 이름
  const [name, setName] = useState<string>('');
  // 전화번호
  const [mobilePhone, setMobilePhone] = useState<string>('');
  // 인증번호
  const [verifyNumber, setVerifyNumber] = useState<string>('');
  // 요청 여부
  const [isRequested, setIsRequested] = useState<boolean>(false);
  // 인증 여부
  const [isVerified, setIsVerified] = useState<boolean>(false);
  // 개인정보 동의 여부
  const [isConsent, setIsConsent] = useState<boolean>(false);

  // 이름 변경 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(getFormattedName(event.target.value));
  };

  // 전화번호 변경 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    setMobilePhone(getFormattedPhone(event.target.value));
  };

  // 인증번호 변경 이벤트
  const onChangeVerifyNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const newVerifyNumber = event.target.value
      .replace(/\D/g, '')
      .trim()
      .slice(0, 6);
    setVerifyNumber(newVerifyNumber);
  };

  // 요청 버튼
  const onClickRequest = async () => {
    try {
      const response = await authApi.getVerificationRequest(
        {},
        {
          name,
          mobilePhone: mobilePhone.replace(/-/g, ''),
          isTest: IS_TEST.PRODUCTION,
        }
      );

      if (response.status === 201) {
        setIsRequested(true);
        console.log(response.data);
        setSecond(300);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 인증 버튼
  const onClickVerify = async () => {
    try {
      const response = await authApi.getVerificationVerify({
        code: verifyNumber,
      });
      if (response.data?.verified) {
        setIsVerified(true);
      }
    } catch (error) {
      setIsVerified(false);
      dispatch(setIsToastShown(true));
    }
  };

  // 개인정보 처리 동의 버튼
  const onClickConsent = () => {
    setIsConsent(!isConsent);
  };

  // 회원가입 완료 버튼: 로딩 상태를 처리
  const onClickDone = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await authApi.getSignIn({
        privacyPolicyAgreed: isVerified,
      });
      if (response.status === 201) {
        const userResponse = await userApi.getMy();
        const newUser = userResponse.data.data;
        dispatch(setUser(newUser));
        router.push('/');
      }
    } catch (error) {
      // console.log('로그인 실패:', error);
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false); // 서버 요청 완료 후 로딩 종료
    }
  };

  // 로그아웃 버튼
  const onClickLogOut = () => {
    const authApi = new AuthApi(false);
    authApi.getLogOut().then(() => {
      window.location.href = '/login';
    });
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

  const props = {
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
  };

  return (
    <>
      <UserRegisterListView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};

export default UserRegisterList;
