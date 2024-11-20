import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-self: center;
  width: 100%;
  height: 100%;

  // 모바일
  @media (min-width: 320px) {
    width: 100%;
  }

  // 태블릿
  @media (min-width: 768px) {
    width: 100%;
  }

  // 데크스탑
  @media (min-width: 1920px) {
    width: 100%;
  }
`;

export default Wrap;
