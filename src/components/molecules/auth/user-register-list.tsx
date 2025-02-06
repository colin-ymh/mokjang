import { ChangeEvent, useEffect, useState } from 'react';

import { AuthApi, IS_TEST } from '@/api/auth/auth.api';
import { setAuthorizationToken } from '@/api/authorize-axios';
import { BLANK } from '@/constants/constant';
import UserRegisterListView from '@/components/molecules/auth/user-register-list.view';
import { getFormattedMobilePhone, getFormattedName } from '@/utils/format';
import { usePageRouter } from '@/utils/router';

const UserRegisterList = () => {
  const router = usePageRouter();
  const authApi = new AuthApi(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 인증 시간 타이머
  const [second, setSecond] = useState<number>(0);

  // 이름
  const [name, setName] = useState<string>(BLANK);

  // 전화번호
  const [mobilePhone, setMobilePhone] = useState<string>(BLANK);

  // 인증번호
  const [verifyNumber, setVerifyNumber] = useState<string>(BLANK);

  // 요청 여부
  const [isRequested, setIsRequested] = useState<boolean>(false);

  // 인증 여부
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // 개인정보 동의여부
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
          isTest: IS_TEST.BETA_TEST,
        }
      );

      if (response.status === 201) {
        setIsRequested(true);
        // console.log(response.data);
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
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 개인정보 처리 동의 버튼
  const onClickConsent = () => {
    setIsConsent(!isConsent);
  };

  // 회원가입 완료 버튼
  const onClickDone = async () => {
    try {
      const response = await authApi.getSignIn({
        privacyPolicyAgreed: isVerified,
      });

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      // AccessToken을 authorizeAxios에 설정
      setAuthorizationToken(accessToken);
      // RefreshToken을 localStorage에 저장
      localStorage.setItem('refreshToken', refreshToken);

      router.push('/church/register');
    } catch (error) {
      console.log('로그인 실패:', error);
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 타이머 감소 로직: 인증 요청 후 1초마다 감소
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
  };

  return (
    <>
      <UserRegisterListView {...props} />
    </>
  );
};

export default UserRegisterList;
