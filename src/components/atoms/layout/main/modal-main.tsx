import styled from 'styled-components';
import { WHITE } from '@/constants/styles/color';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';

export const ModalMain = styled.div`
  background-color: ${WHITE};
  border-radius: 5px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  gap: 30px;
  overflow: hidden;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    width: 100%;
    height: 100%;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    width: 500px;
    height: 700px;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    width: 500px;
    height: 700px;
  }
`;

export default ModalMain;
