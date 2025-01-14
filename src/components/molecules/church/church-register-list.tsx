import styled from 'styled-components';

import LabelInput from '@/components/atoms/common/input/label-input';
import Button from '@/components/atoms/common/button/button';

import { useScopedI18n } from '../../../../locales/client';
import { usePageRouter } from '@/utils/router';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  bottom: 40px;
`;

const ChurchRegisterList = () => {
  const t_button = useScopedI18n('button');
  const router = usePageRouter();

  const onClickButton = () => {
    router.push('/church/register/group');
  };

  return (
    <ListContainer>
      <InputContainer>
        <LabelInput label={'교회명'} />
        <LabelInput label={'교단명'} />
        <LabelInput label={'고유번호'} />
        <LabelInput label={'교회주소'} />
        <LabelInput label={'대표번호'} />
        <LabelInput label={'교인 수'} />
      </InputContainer>
      <ButtonContainer>
        <Button
          text={t_button('register')}
          height={40}
          onClick={onClickButton}
        />
      </ButtonContainer>
    </ListContainer>
  );
};

export default ChurchRegisterList;
