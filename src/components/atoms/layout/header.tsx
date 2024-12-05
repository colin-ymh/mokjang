import styled from "styled-components";

import { MEDIA_MIN_WIDTH } from "@/constants/constant";

const Header = styled.div`
  // 모바일
  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  // 태블릿
  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

export default Header;
