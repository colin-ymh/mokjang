'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setUser } from '@/redux/reducers/user-reducer';

// import {
//   resetAuthorizationToken,
//   setAuthorizationToken,
// } from '@/api/authorize-axios';
import { AuthApi, IS_TEST } from '@/api/auth/auth.api';
import UserRegisterListView from '@/components/molecules/auth/user-register-list.view';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { TOAST_DIRECTION } from '@/components/atoms/common/popup/toast-popup.view';
import Loading from '@/components/atoms/common/etc/loading';
import { getFormattedMobilePhone, getFormattedName } from '@/utils/format';
import { usePageRouter } from '@/utils/router';

import { useScopedI18n } from '../../../../locales/client';
import { UserApi } from '@/api/user/user.api';

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

  const [isErrorShown, setIsErrorShown] = useState<boolean>(false);
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
    setMobilePhone(getFormattedMobilePhone(event.target.value));
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
        setSecond(1800);
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
      setIsErrorShown(true);
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
      console.log(response);
      if (response.status === 201) {
        router.replace('/church/register');

        const userResponse = await userApi.getUser();
        const newUser = userResponse.data;
        dispatch(setUser(newUser));
      }
    } catch (error) {
      console.log('로그인 실패:', error);
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false); // 서버 요청 완료 후 로딩 종료
    }
  };

  // 로그아웃 버튼
  const onClickLogOut = () => {
    const authApi = new AuthApi(false);
    authApi.getLogOut().then(() => {
      router.replace('/login');
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
      {isErrorShown && (
        <ToastPopup
          text={t_popup('verifyFail')}
          setIsShow={setIsErrorShown}
          backgroundColor={DESTRUCTIVE.DEFAULT}
          direction={TOAST_DIRECTION.BOTTOM}
        />
      )}
      <Loading isShow={isLoading} />
    </>
  );
};

export default UserRegisterList;
