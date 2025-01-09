import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import EducationModal from '@/components/atoms/modal/education-modal';
import { EducationHistory } from '@/models/member/history';

import { useI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';
import EducationHistoryItem from '@/components/atoms/member/information/education-history-item';
import { EDUCATION_STATUS } from '@/constants/constant';

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

const EducationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
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
  educationHistory: EducationHistory[];
  targetEducation: EducationHistory;
  isModalShown: boolean;
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
  onClickEditEducation: (education: EducationHistory) => void;
  onClickSaveNewEducation: (
    educationId: string,
    startDate: string,
    status: EDUCATION_STATUS
  ) => void;
  onClickSaveEditEducation: (
    educationId?: string,
    startDate?: string,
    endDate?: string,
    status?: EDUCATION_STATUS
  ) => void;
  onClickDeleteEducation: (educationId: string) => void;
};

const MemberEducationView = ({
  educationHistory,
  targetEducation,
  isModalShown,
  onClickOpenModal,
  onClickCloseModal,
  onClickEditEducation,
  onClickSaveNewEducation,
  onClickSaveEditEducation,
  onClickDeleteEducation,
}: MemberEducationViewProps) => {
  const t = useI18n();
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
      {/* 이력 */}
      <EducationListContainer>
        {educationHistory.map((education) => {
          return (
            <EducationHistoryItem
              education={education}
              onClickEditEducation={onClickEditEducation}
              onClickDeleteEducation={onClickDeleteEducation}
            />
          );
        })}
      </EducationListContainer>
      {/* 교육 추가 및 수정 모달*/}
      {isModalShown && (
        <ModalContainer $isShown={isModalShown}>
          <EducationModal
            prevEducation={targetEducation}
            onClickClose={onClickCloseModal}
            onClickSaveNewEducation={onClickSaveNewEducation}
            onClickSaveEditEducation={onClickSaveEditEducation}
          />
        </ModalContainer>
      )}
    </ListContainer>
  );
};

export default MemberEducationView;
