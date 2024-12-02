import styled from "styled-components";
import { MEDIA_MIN_WIDTH } from "@/constant/constant";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    flex-direction: row;
  }
`;

export default Wrap;
