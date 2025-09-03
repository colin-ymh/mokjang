import styled from 'styled-components';

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column; /* ← row → column */
  height: 100%; /* 뷰포트 전체 높이 */
  overflow: hidden; /* 내부에서 스크롤은 콘텐츠 영역만 */
`;

export default PopupContainer;
