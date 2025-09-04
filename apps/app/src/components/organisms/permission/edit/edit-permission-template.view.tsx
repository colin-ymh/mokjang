import styled from 'styled-components';
import { LabelInput } from '@mokjang/components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY } from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

const EditPermissionTemplateViewContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 20px 50px 20px;
  gap: 20px;
  overflow-y: auto;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

type EditPermissionTemplateViewProps = {
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: ChangeEvent<HTMLInputElement>) => void;
};

const EditPermissionTemplateView = ({
  onChangeName,
  onChangeDescription,
}: EditPermissionTemplateViewProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <EditPermissionTemplateViewContainer>
      {/* 제목 */}
      <InputContainer>
        <LabelInput
          label={t('title')}
          value={targetPermissionTemplate.title}
          onChange={onChangeName}
          placeholder={t_placeholder('title')}
          borderColor={GRAY.LIGHT}
          height={40}
          isRequired={true}
        />
      </InputContainer>
      {/* 설명 */}
      <InputContainer>
        <LabelInput
          label={t('description')}
          value={targetPermissionTemplate.description}
          onChange={onChangeDescription}
          placeholder={t_placeholder('description')}
          borderColor={GRAY.LIGHT}
          height={40}
        />
      </InputContainer>
    </EditPermissionTemplateViewContainer>
  );
};

export default EditPermissionTemplateView;
