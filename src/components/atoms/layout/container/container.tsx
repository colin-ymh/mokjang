import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row; /* ← row → column */
  height: 100vh; /* 뷰포트 전체 높이 */
  overflow: hidden; /* 내부에서 스크롤은 콘텐츠 영역만 */
`;

export default Container;
