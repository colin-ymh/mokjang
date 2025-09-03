import styled from 'styled-components';

import { Svg } from '@mokjang/assets';
import { MainText, SvgIcon } from '../../../../../../packages/components/src';
import {
  BLACK,
  GRAY,
  GREEN,
  MAIN,
  WHITE,
} from '../../../../../../packages/constants/src';
import { useScopedI18n } from '../../../../locales/client';
import ArrowRight from '../../../../public/svg/arrow-right.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 800px;
  gap: 50px;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const IconContainer = styled.div`
  display: flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background-color: ${GREEN.LIGHT};
  border-radius: 100%;
`;

const ButtonItem = styled.div<{
  $backgroundColor: string;
  $borderColor: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  width: 460px;
  height: 50px;
  padding: 20px 30px 20px 20px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: ${({ $borderColor }) => `2px solid ${$borderColor}`};
  cursor: pointer;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export type RegisterCompleteViewProps = {
  onClickCreateChurch: () => void;
  onClickJoin: () => void;
};

const RegisterCompleteView = ({
  onClickCreateChurch,
  onClickJoin,
}: RegisterCompleteViewProps) => {
  const t_register = useScopedI18n('register-complete');
  return (
    <>
      <Container>
        <HeaderContainer>
          <IconContainer>
            <SvgIcon
              svg={Svg.Check}
              color={GREEN.DEFAULT}
              width={3}
              size={25}
            />
          </IconContainer>
          <MainText fontSize={24} fontWeight={700}>
            {t_register('title')}
          </MainText>
          <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
            {t_register('description')}
          </MainText>
        </HeaderContainer>
        <ButtonList>
          <ButtonItem
            $backgroundColor={MAIN.DEFAULT}
            $borderColor={MAIN.DEFAULT}
          >
            <ButtonContent>
              <MainText fontSize={18} fontWeight={600} color={WHITE}>
                {t_register('freeTrial.title')}
              </MainText>
              <MainText fontSize={14} fontWeight={600} color={MAIN.LIGHT}>
                {t_register('freeTrial.description')}
              </MainText>
            </ButtonContent>
            <SvgIcon svg={ArrowRight} color={WHITE} width={2} size={18} />
          </ButtonItem>
          <ButtonItem
            $backgroundColor={WHITE}
            $borderColor={GRAY.LIGHT}
            onClick={onClickCreateChurch}
          >
            <ButtonContent>
              <MainText fontSize={18} fontWeight={600}>
                {t_register('createChurch.title')}
              </MainText>
              <MainText fontSize={14} fontWeight={600} color={GRAY.DARK}>
                {t_register('createChurch.description')}
              </MainText>
            </ButtonContent>
            <SvgIcon svg={ArrowRight} color={BLACK} width={2} size={18} />
          </ButtonItem>
          <ButtonItem
            $backgroundColor={WHITE}
            $borderColor={GRAY.LIGHT}
            onClick={onClickJoin}
          >
            <ButtonContent>
              <MainText fontSize={18} fontWeight={600}>
                {t_register('registerAdmin.title')}
              </MainText>
              <MainText fontSize={14} fontWeight={600} color={GRAY.DARK}>
                {t_register('registerAdmin.description')}
              </MainText>
            </ButtonContent>
            <SvgIcon svg={ArrowRight} color={BLACK} width={2} size={18} />
          </ButtonItem>
        </ButtonList>
      </Container>
    </>
  );
};

export default RegisterCompleteView;
