import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import EducationModal from '@/components/molecules/member/information/modal/education-modal';

import { useI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  border-top: 1px solid ${GRAY.LIGHT};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${GRAY.LIGHT};
`;

const ButtonContainer = styled.div`
  display: flex;
  background-color: ${GRAY.DEFAULT};
  border-radius: 5px;
  cursor: pointer;
`;

const PlusButton = styled(Plus)`
  stroke: ${WHITE};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
`;

const ModalContainer = styled.div<{ $isShown: boolean }>`
  //display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  display: flex;
  position: absolute;

  z-index: 200;
  background-color: ${WHITE};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  right: 10px;
  top: 40px;
`;

type MemberEducationViewProps = {
  targetEducationId: string;
  isModalShown: boolean;
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
};

const MemberEducationView = ({
  targetEducationId,
  isModalShown,
  onClickOpenModal,
  onClickCloseModal,
}: MemberEducationViewProps) => {
  const t = useI18n();
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember
  );

  return (
    <ListContainer>
      {/* 교육 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('education')}</MainText>
        {/* 교육 추가 버튼*/}
        <ButtonContainer onClick={onClickOpenModal}>
          <PlusButton />
        </ButtonContainer>
      </ListTypeHeader>

      {/* 교인 가족 추가 및 수정 모달*/}
      {isModalShown && (
        <ModalContainer $isShown={isModalShown}>
          <EducationModal
            prevEducationId={targetEducationId}
            onClickClose={onClickCloseModal}
          />
        </ModalContainer>
      )}
    </ListContainer>
  );
};

export default MemberEducationView;
