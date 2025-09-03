import styled from 'styled-components';
import LabelInput from '../../../atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY } from '../../../../constants/styles/color';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { MainText } from '../../../atoms/common/text/main-text';
import PermissionUnitList from '../../../molecules/permission/information/permission-unit-list';
import { SIZE } from '@/constants/styles/style';

const AddPermissionTemplateViewContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 20px 50px 20px;
  gap: 20px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

type AddPermissionTemplateViewProps = {
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeUnitIds: (unitIds: string[]) => void;
};

const AddPermissionTemplateView = ({
  onChangeName,
  onChangeDescription,
  onChangeUnitIds,
}: AddPermissionTemplateViewProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <AddPermissionTemplateViewContainer>
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
      {/* 권한 */}
      <InputContainer>
        <MainText color={GRAY.DARK} size={SIZE.SMALL}>
          {t('permission')}
        </MainText>
        <PermissionUnitList
          selectedUnitIds={targetPermissionTemplate?.unitIds || []}
          onChangeUnitIds={onChangeUnitIds}
        />
      </InputContainer>
    </AddPermissionTemplateViewContainer>
  );
};

export default AddPermissionTemplateView;
