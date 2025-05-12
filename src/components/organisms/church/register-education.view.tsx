import React, { ChangeEvent, Dispatch, LegacyRef, SetStateAction } from 'react';
import styled from 'styled-components';

import { Education } from '@/models/management/management';
import ManagementEducationItem from '@/components/atoms/education/management-education-item';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import AddEducation from '@/components/atoms/education/add-education';

import { useScopedI18n } from '../../../../locales/client';

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 자식 요소가 컨테이너를 넘지 않도록 설정 */
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  flex-shrink: 0; /* 버튼 컨테이너가 줄어들지 않도록 설정 */
`;

const EducationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 0 5%;
  overflow-y: auto; /* 높이 초과 시 스크롤 활성화 */
  flex-grow: 1; /* 남은 공간을 차지하도록 설정 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 60px; /* 고정 높이 설정 */
  padding: 0 20px;
  flex-shrink: 0; /* 버튼 컨테이너가 줄어들지 않도록 설정 */
`;

type EducationListViewProps = {
  educations: Education[];
  selectedEducationId: string | null;
  setSelectedEducation: Dispatch<SetStateAction<Education>>;
  fetchEducations: () => void;
  nameInputRef: LegacyRef<HTMLInputElement>;
  newEducationName: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveEducation: () => void;
  onClickSave: () => void;
};

const RegisterEducationView = ({
  educations,
  selectedEducationId,
  setSelectedEducation,
  fetchEducations,
  nameInputRef,
  newEducationName,
  onChangeName,
  onClickSaveEducation,
  onClickSave,
}: EducationListViewProps) => {
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');

  return (
    <EducationContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_register('educationHeaderPhrase')}
        </MainText>
      </TextContainer>
      <EducationListContainer>
        {educations.map((education) => (
          <ManagementEducationItem
            key={education.id}
            education={education}
            selectedEducationId={selectedEducationId}
            setSelectedEducation={setSelectedEducation}
            fetchEducations={fetchEducations}
          />
        ))}
        <AddEducation
          ref={nameInputRef}
          isShown={true}
          name={newEducationName}
          onChangeName={onChangeName}
          onClickSaveEducation={onClickSaveEducation}
        />
      </EducationListContainer>
      <ButtonContainer>
        <Button text={t_button('register')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </EducationContainer>
  );
};

export default RegisterEducationView;
