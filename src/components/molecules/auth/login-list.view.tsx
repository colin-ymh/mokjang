import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY } from '@/constants/styles/color';
import { AUTH } from '@/api/auth/auth.api';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 10px;
  padding: 10px;
  width: 80%;
`;

const OAuthItem = styled.div`
  cursor: pointer;
  display: flex;
  border-radius: 5px;
  border: 1px solid ${GRAY.LIGHT};
  height: 40px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type LoginListViewProps = {
  onClickItem: (provider: AUTH) => void;
};

const LoginListView = ({ onClickItem }: LoginListViewProps) => {
  return (
    <ListContainer>
      <OAuthItem onClick={() => onClickItem(AUTH.NAVER)}>
        <MainText color={BLACK}>{'네이버'}</MainText>
      </OAuthItem>
      <OAuthItem onClick={() => onClickItem(AUTH.GOOGLE)}>
        <MainText color={BLACK}>{'구글'}</MainText>
      </OAuthItem>
      <OAuthItem onClick={() => onClickItem(AUTH.KAKAO)}>
        <MainText color={BLACK}>{'카카오'}</MainText>
      </OAuthItem>
      <OAuthItem>
        <MainText color={BLACK}>{'애플'}</MainText>
      </OAuthItem>
    </ListContainer>
  );
};

export default LoginListView;
