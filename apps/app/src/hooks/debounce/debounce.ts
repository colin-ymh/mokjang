'use client';

import { useEffect, useState } from 'react';

/**
 * 특정 값을 시간 차를 두고 적용
 * (검색 내용이 즉시 반영되지 않도록 활용 중)
 * @param value
 * @param delay
 */
export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
