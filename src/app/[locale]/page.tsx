// import { redirect } from 'next/navigation';
//
// export default function LocaleRootPage({
//   params,
// }: {
//   params: { locale: string };
// }) {
//   // /ko  → /ko/main
//   // /en  → /en/main
//   redirect(`/${params.locale}/main`);
// }
'use client';

import ModalLayout from '@/components/organisms/layout/modal-layout';
import Button from '@/components/atoms/common/button/button';
import styled from 'styled-components';
import BorderInput from '@/components/atoms/common/input/border-input';
import { useState } from 'react';
import { usePageRouter } from '@/utils/router';
import { JoinRequestsApi } from '@/api/join-request/join-request.api';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

export default function LoginPage() {
  const router = usePageRouter();
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
      </ButtonContainer>
    </ModalLayout>
  );
}
