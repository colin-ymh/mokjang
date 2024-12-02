import styled from "styled-components";
import { MEDIA_MIN_WIDTH } from "@/constant/constant";

export const Main = styled.div`
  width: 100%;
  max-width: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    margin-top: 50px;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    margin-top: 50px;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    margin-top: 0;
  }
`;

export default Main;
