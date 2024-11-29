import React from "react";
import styled from "styled-components";

const HideContainer = styled.div`
  display: none;
`;

// 조건에 따라 특정 컴포넌트를 아예 가리기 위해 사용되는 컴포넌트
const Hide = () => {
  return <HideContainer />;
};

export default Hide;
