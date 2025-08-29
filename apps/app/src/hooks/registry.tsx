'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

/**
 * 서버 사이드 렌더링 시 styled-components 의 스타일을 수집하고 삽입해주는 역할을 합니다.
 * @param children
 * @constructor
 */
const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [styledComponentsStyleSheet] = useState(() =>
    typeof window === 'undefined' ? new ServerStyleSheet() : null
  );

  useServerInsertedHTML(() => {
    if (styledComponentsStyleSheet) {
      // 수집된 스타일을 React 요소로 반환
      const styles = styledComponentsStyleSheet.getStyleElement();
      // 스타일 수집 후 내부 Tag 초기화 → 중복 삽입 방지
      styledComponentsStyleSheet.instance.clearTag();
      // <style> 태그들을 삽입
      return <>{styles}</>;
    }
    return null;
  });

  if (!styledComponentsStyleSheet) return <>{children}</>; // 클라이언트에서는 그냥 렌더

  return (
    // 서버에서는 StyleSheetManager 를 통해 styled-components 의 스타일 수집을 자식 트리에 적용
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
};

export default StyledComponentsRegistry;
