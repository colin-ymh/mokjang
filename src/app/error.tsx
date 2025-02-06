'use client';

import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = usePageRouter();
  const [isShown, setIsShown] = useState<boolean>(false);

  useEffect(() => {
    setIsShown(true);
  }, [error]);

  return (
    <ConfirmPopup
      buttonNum={1}
      title={'에러가 발생했습니다.'}
      body={error.message}
      isShow={isShown}
      onClickSingleButton={() => {
        setIsShown(false);
        router.push('');
      }}
      singleButtonText={'확인'}
    />
  );
}
