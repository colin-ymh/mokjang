import styled from 'styled-components';
import React from 'react';
import { useI18n } from '../../../../../../locales/client';
import { Ministry } from '@/models/management/management';
import LabelInput from '@/components/atoms/common/input/label-input';
import { MainText } from '@/components/atoms/common/text/main-text';
import MainTag from '@/components/atoms/common/tag/main-tag';
import { GRAY } from '@/constants/styles/color';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const MinistryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MinistryList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

type EditMinistryViewProps = {
  ministries: Ministry[];
  editName: string;
  onChangeEditMinistryName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const EditMinistryView = ({
  editName,
  ministries,
  onChangeEditMinistryName,
}: EditMinistryViewProps) => {
  const t = useI18n();

  return (
    <>
      <EditContainer>
        <LabelInput
          label={t('ministryName')}
          value={editName}
          onChange={onChangeEditMinistryName}
          placeholder={t('placeholder.ministryName')}
        />
        <MinistryListContainer>
          <MainText color={GRAY.DARK}>{t('currentMinistry')}</MainText>
          <MinistryList>
            {ministries.map((ministry) => (
              <MainTag title={ministry.name} />
            ))}
          </MinistryList>
        </MinistryListContainer>
      </EditContainer>
    </>
  );
};

export default EditMinistryView;
