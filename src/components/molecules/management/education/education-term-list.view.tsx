import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { Education, EducationTerm } from '@/models/management/management';
import TermTable from '@/components/molecules/management/education/term-table';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import TermRegister from '@/components/atoms/management/education/term-register';

import { useI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';

const EducationTermContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListTypeHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
`;

const PlusButton = styled(Plus)`
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type EducationTermViewProps = {
  education: Education;
  terms: EducationTerm[];
  isModalShown: boolean;
  fetchTerms: () => void;
  onClickModalOpen: () => void;
  onClickModalClose: () => void;
};

const EducationTermListView = ({
  education,
  terms,
  isModalShown,
  fetchTerms,
  onClickModalOpen,
  onClickModalClose,
}: EducationTermViewProps) => {
  const t = useI18n();

  return (
    <EducationTermContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('term')}</MainText>
        <PlusButton onClick={onClickModalOpen} />
        <CustomPopup
          isShow={isModalShown}
          onClickClose={onClickModalClose}
          width={30}
          height={80}
          isPercentage={true}
        >
          <TermRegister
            education={education}
            terms={terms}
            onClickClose={onClickModalClose}
            fetchTerms={fetchTerms}
          />
        </CustomPopup>
      </ListTypeHeader>
      <TermTable education={education} terms={terms} />
    </EducationTermContainer>
  );
};

export default EducationTermListView;
