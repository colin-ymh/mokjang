'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000; /* 다른 콘텐츠 위에 충분히 높게 설정 */
  background-color: rgba(0, 0, 0, 0.3); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0; /* 초기 투명도 */
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
`;

type LoadingProps = {
  isShow: boolean;
  loadingText?: string;
};

const Loading = ({ isShow, loadingText = 'Loading...' }: LoadingProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // 내부 state: 실제 렌더링 여부를 결정 (0.5초 이상 지속 시에만 true)
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isShow) {
      // 0.2초 후에 로딩을 렌더링하도록 타이머 설정
      timer = setTimeout(() => {
        setShouldRender(true);
      }, 200);
    } else {
      // isShow가 false이면 즉시 렌더링 중지
      setShouldRender(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isShow]);

  useEffect(() => {
    if (ref.current && shouldRender) {
      // 로딩 컴포넌트가 렌더링될 때 fade-in 애니메이션 적용
      gsap.to(ref.current, { opacity: 1, duration: 0.5 });
    }
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <Overlay>
      <LoadingContainer ref={ref}>
        <Spinner />
        <LoadingText>{loadingText}</LoadingText>
      </LoadingContainer>
    </Overlay>
  );
};

export default Loading;
