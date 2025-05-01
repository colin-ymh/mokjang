import { ChangeEvent, Dispatch, ForwardedRef, SetStateAction } from 'react';
import styled from 'styled-components';

import EducationList from '@/components/molecules/management/education/education-list';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { EDUCATION_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import HeaderBar, {
  HeaderBarItem,
} from '@/components/atoms/layout/header/header-bar';
import { getEducationManagementContent } from '@/hooks/layout/render-layout';
import { Education } from '@/models/management/management';
import AddEducation from '@/components/atoms/management/education/add-education';

import { useI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';

const EducationManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const EducationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.SEMI_LIGHT};
  width: 200px;
  flex-shrink: 0;
`;

const ListHeader = styled.div`
  display: flex;
  position: relative;
`;

const PlusButton = styled(Plus)`
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const EducationInformationContainer = styled.div<{ $isEducation: boolean }>`
  display: ${({ $isEducation }) => ($isEducation ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
`;

const EducationInformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  gap: 10px;
  padding: 20px 20px 0 20px;
`;

type EducationManagementViewProps = {
  educations: Education[];
  fetchEducations: () => void;
  selectedEducation: Education;
  setSelectedEducation: Dispatch<SetStateAction<Education>>;
  headerBarId: string;
  headerBarItems: HeaderBarItem[];
  isAddModalShown: boolean;
  nameInputRef: ForwardedRef<HTMLInputElement>;
  newEducationName: string;
  onClickModalOpen: () => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveEducation: () => void;
  onClickHeaderBar: (id: EDUCATION_MANAGEMENT_HEADER_ID) => void;
};

const EducationManagementView = ({
  educations,
  fetchEducations,
  selectedEducation,
  setSelectedEducation,
  headerBarId,
  headerBarItems,
  isAddModalShown,
  nameInputRef,
  newEducationName,
  onClickModalOpen,
  onChangeName,
  onClickSaveEducation,
  onClickHeaderBar,
}: EducationManagementViewProps) => {
  const t = useI18n();
  return (
    <EducationManagementContainer>
      {/* 교육 목록 */}
      <EducationListContainer>
        {/* 헤더 */}
        <ListHeader>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {t('educationList')}
          </MainText>
          {/* 추가 버튼 */}
          <PlusButton onClick={onClickModalOpen} />
        </ListHeader>
        {/* 추가창 */}
        <AddEducation
          ref={nameInputRef}
          isShown={isAddModalShown}
          name={newEducationName}
          onChangeName={onChangeName}
          onClickSaveEducation={onClickSaveEducation}
        />
        {/* 교육 목록 */}
        <EducationList
          educations={educations}
          fetchEducations={fetchEducations}
          selectedEducationId={selectedEducation.id}
          setSelectedEducation={setSelectedEducation}
        />
      </EducationListContainer>
      {/* 교육 정보 */}
      <EducationInformationContainer $isEducation={!!selectedEducation.id}>
        {/* 헤더 */}
        <EducationInformationHeader>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {selectedEducation.name}
          </MainText>
          <HeaderBar
            value={headerBarId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        </EducationInformationHeader>
        {/* 컨텐츠 */}
        {getEducationManagementContent(headerBarId, selectedEducation)}
      </EducationInformationContainer>
    </EducationManagementContainer>
  );
};

export default EducationManagementView;
