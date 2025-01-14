import React, { ChangeEvent, Dispatch, LegacyRef, SetStateAction } from 'react';
import styled from 'styled-components';

import { Officer } from '@/models/management/management';
import ManagementOfficerItem from '@/components/atoms/management/officer/management-officer-item';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import AddOfficer from '@/components/atoms/management/officer/add-officer';

import { useScopedI18n } from '../../../../locales/client';

const OfficerContainer = styled.div`
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

const OfficerListContainer = styled.div`
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

type OfficerListViewProps = {
  officers: Officer[];
  selectedOfficerId: string | null;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
  fetchOfficers: () => void;
  nameInputRef: LegacyRef<HTMLInputElement>;
  newOfficerName: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveOfficer: () => void;
  onClickSave: () => void;
};

const RegisterOfficerView = ({
  officers,
  selectedOfficerId,
  setSelectedOfficer,
  fetchOfficers,
  nameInputRef,
  newOfficerName,
  onChangeName,
  onClickSaveOfficer,
  onClickSave,
}: OfficerListViewProps) => {
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');

  return (
    <OfficerContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_register('officerHeaderPhrase')}
        </MainText>
      </TextContainer>
      <OfficerListContainer>
        {officers.map((officer) => (
          <ManagementOfficerItem
            key={officer.id}
            officer={officer}
            selectedOfficerId={selectedOfficerId}
            setSelectedOfficer={setSelectedOfficer}
            fetchOfficers={fetchOfficers}
          />
        ))}
        <AddOfficer
          ref={nameInputRef}
          isShown={true}
          name={newOfficerName}
          onChangeName={onChangeName}
          onClickSaveOfficer={onClickSaveOfficer}
        />
      </OfficerListContainer>
      <ButtonContainer>
        <Button text={t_button('register')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </OfficerContainer>
  );
};

export default RegisterOfficerView;
