import styled from 'styled-components';
import { MEDIA_MIN_WIDTH } from '../../../constants/constant';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  // @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
  //   flex-direction: row;
  // }
`;

export default Wrap;
