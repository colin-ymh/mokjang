import styled from 'styled-components';
import { WHITE } from '@mokjang/constants';

const BackgroundContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${WHITE};
`;

export default BackgroundContainer;
