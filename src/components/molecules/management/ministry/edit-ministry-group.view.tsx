import React, { ChangeEvent, Dispatch, LegacyRef, SetStateAction } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Ministry } from '@/models/management/management';
import ManagementMinistryItem from '@/components/atoms/management/ministry/management-ministry-item';
import AddMinistry from '@/components/atoms/management/ministry/add-ministry';

const MinistryGroupContainer = styled.div`
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

const NameContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  flex-shrink: 0;
`;

const MinistryGroupMinistrysListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
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

type MinistryGroupListViewProps = {
  newMinistryRef: LegacyRef<HTMLInputElement>;
  newName: string;
  newMinistryName: string;
  ministries: Ministry[];
  selectedMinistryId: string | null;
  setMinistries: Dispatch<SetStateAction<Ministry[]>>;
  setSelectedMinistry: Dispatch<SetStateAction<Ministry>>;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeNewMinistryName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSave: () => void;
  onClickSaveNewMinistry: () => void;
};

const EditMinistryMinistryGroupView = ({
  newMinistryRef,
  newName,
  newMinistryName,
  ministries,
  selectedMinistryId,
  setMinistries,
  setSelectedMinistry,
  onChangeName,
  onChangeNewMinistryName,
  onClickSave,
  onClickSaveNewMinistry,
}: MinistryGroupListViewProps) => {
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');
  const t = useI18n();
  return (
    <MinistryGroupContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_register('groupHeaderPhrase')}
        </MainText>
      </TextContainer>
      <NameContainer>
        <LabelInput
          label={t('groupName')}
          value={newName}
          onChange={onChangeName}
        />
      </NameContainer>
      <MinistryGroupMinistrysListContainer>
        <MainText>{t('groupRole')}</MainText>
        {ministries.map((ministry) => (
          <ManagementMinistryItem
            key={ministry.id}
            ministry={ministry}
            ministries={ministries}
            setMinistries={setMinistries}
            selectedMinistryId={selectedMinistryId}
            setSelectedMinistry={setSelectedMinistry}
          />
        ))}
        <AddMinistry
          ref={newMinistryRef}
          name={newMinistryName}
          onChangeName={onChangeNewMinistryName}
          onClickSaveMinistry={onClickSaveNewMinistry}
          isShown={true}
        />
      </MinistryGroupMinistrysListContainer>
      <ButtonContainer>
        <Button text={t_button('edit')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </MinistryGroupContainer>
  );
};

export default EditMinistryMinistryGroupView;
