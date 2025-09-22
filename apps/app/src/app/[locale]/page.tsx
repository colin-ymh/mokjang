'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { IS_PRODUCTION, usePageRouter } from '@mokjang/utils';
import { JoinRequestsApi } from '../../api/join-request/join-request.api';
import { useSelector } from 'react-redux';
import { RootState } from '@mokjang/landing/src/redux/store';
import ModalLayout from '@/components/organisms/layout/modal-layout';
import { BorderInput, Button } from '@mokjang/components';
import LogoutButton from '@/components/atoms/common/button/logout-button';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

export default function LoginPage() {
  const { user, initialized } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();

  useEffect(() => {
    // 초기화가 끝났는데 유저가 없으면 보호 라우트 → 홈으로
    if (initialized && !user?.id) {
      // routeLandingPage('/');
    } else if (user?.id) {
      router.push('/main');
    }
  }, [initialized, user?.id, router]);

  // 초기화 전에는 아무것도 렌더링하지 않거나 로딩 표시
  if (!initialized) return null; // or <Spinner />

  const [code, setCode] = useState<string>('');

  const joinRequestsApi = new JoinRequestsApi(false);

  const onChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const onClickEnterCode = () => {
    joinRequestsApi.createJoinRequest({ joinCode: code });
  };

  const onClickCreateChurch = () => {
    router.push('/church/register');
  };

  if (IS_PRODUCTION) return null;
  // 초기화가 끝났고 유저가 없으면 리다이렉트 직전 상태 → 렌더링 스킵
  if (!user?.id) router.push('/login');

  return (
    <ModalLayout>
      <ButtonContainer>
        <BorderInput value={code} onChange={onChangeCode} />
        <Button
          text={'초대코드로 입장하기'}
          onClick={onClickEnterCode}
          height={30}
        />

        <Button
          text={'새로운 교회 생성하기'}
          onClick={onClickCreateChurch}
          height={30}
        />

        <LogoutButton />
      </ButtonContainer>
    </ModalLayout>
  );
}
