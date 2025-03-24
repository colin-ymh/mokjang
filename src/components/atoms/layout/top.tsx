import styled from 'styled-components';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { GRAY } from '@/constants/styles/color';

const Top = styled.div`
  display: none;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
    height: 50px;
    width: 100%;
    border-bottom: 1px solid ${GRAY.LIGHT};
    background-color: ${GRAY.SIDE_BAR};
  }
`;

export default Top;
