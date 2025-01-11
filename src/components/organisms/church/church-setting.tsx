import styled from 'styled-components';

import { MEDIA_MIN_WIDTH } from '@/constants/constant';

const ChurchManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    padding: 0;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    padding: 0 20%;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    padding: 0 30%;
  }
`;

const ChurchManagement = () => {
  return <ChurchManagementContainer></ChurchManagementContainer>;
};

export default ChurchManagement;
