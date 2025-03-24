import styled from 'styled-components';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  width: 100%;

  // @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
  //   flex-direction: row;
  // }
`;

export default Wrap;
