import { ChangeEvent } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import LabelInput from '@/components/atoms/common/input/label-input';
import { SIZE } from '@/constants/styles/style';
import Button from '@/components/atoms/common/button/button';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  gap: 40px;
  padding: 10px;
  width: 80%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
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
  name: string;
  phone: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickItem: () => void;
};

const LoginListView = ({
  name,
  phone,
  onChangeName,
  onChangePhone,
  onClickItem,
}: LoginListViewProps) => {
  return (
    <ListContainer>
      <TextContainer>
        <MainText size={SIZE.LARGE}>{'목장 테스트 로그인'}</MainText>
        <MainText size={SIZE.MEDIUM} color={GRAY.DEFAULT}>
          {'테스트용 로그인을 위한 화면입니다.'}
        </MainText>
        <MainText size={SIZE.MEDIUM} color={GRAY.DEFAULT}>
          {'이름과 전화번호가 아이디와 비밀번호로 사용됩니다.'}
        </MainText>
      </TextContainer>
      <InputContainer>
        <LabelInput label={'이름'} value={name} onChange={onChangeName} />
        <LabelInput label={'전화번호'} value={phone} onChange={onChangePhone} />
      </InputContainer>

      {/*<OAuthItem onClick={() => onClickItem(AUTH.NAVER)}>*/}
      {/*  <MainText color={BLACK}>{'네이버'}</MainText>*/}
      {/*</OAuthItem>*/}
      {/*<OAuthItem onClick={() => onClickItem(AUTH.GOOGLE)}>*/}
      {/*  <MainText color={BLACK}>{'구글'}</MainText>*/}
      {/*</OAuthItem>*/}
      {/*<OAuthItem onClick={() => onClickItem(AUTH.KAKAO)}>*/}
      {/*  <MainText color={BLACK}>{'카카오'}</MainText>*/}
      {/*</OAuthItem>*/}
      {/*<OAuthItem>*/}
      {/*  <MainText color={BLACK}>{'애플'}</MainText>*/}
      {/*</OAuthItem>*/}
      <Button text={'로그인'} onClick={onClickItem} height={40} />
    </ListContainer>
  );
};

export default LoginListView;
