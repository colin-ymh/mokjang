'use client';

import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [isShown, setIsShown] = useState<boolean>(false);

  useEffect(() => {
    setIsShown(true);
  }, [error]);

  return <div>{'에러가 발생했습니다.'}</div>;
}
