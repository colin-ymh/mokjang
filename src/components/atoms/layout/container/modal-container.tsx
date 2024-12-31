import styled from "styled-components";
import { MAIN } from "@/constants/styles/color";

const BackgroundContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${MAIN.DARK};
`;

export default BackgroundContainer;
