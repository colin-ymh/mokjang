import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ACTION, DOMAIN, PermissionUnit } from '@/models/permission/permission';
import { MainText } from '@/components/atoms/common/text/main-text';
import PermissionUnitList from '@/components/molecules/permission/permission-unit-list';

const AddPermissionTemplateViewContainer = styled.div`
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

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
`;

type AddPermissionTemplateViewProps = {
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeUnitIds: (unitIds: string[]) => void;
};

const AddPermissionTemplateView = ({
  onChangeName,
  onChangeUnitIds,
}: AddPermissionTemplateViewProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const tempUnits: PermissionUnit[] = [
    { id: '1', domain: DOMAIN.MEMBER, action: ACTION.READ },
    { id: '2', domain: DOMAIN.MEMBER, action: ACTION.WRITE },
    { id: '3', domain: DOMAIN.VISITATION, action: ACTION.READ },
    { id: '4', domain: DOMAIN.VISITATION, action: ACTION.WRITE },
    { id: '5', domain: DOMAIN.TASK, action: ACTION.READ },
    { id: '6', domain: DOMAIN.TASK, action: ACTION.WRITE },
    { id: '7', domain: DOMAIN.EDUCATION, action: ACTION.READ },
    { id: '8', domain: DOMAIN.EDUCATION, action: ACTION.WRITE },
  ];

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <AddPermissionTemplateViewContainer>
      {/* 제목 */}
      <InputContainer>
        <LabelInput
          label={t('name')}
          value={targetPermissionTemplate.name}
          onChange={onChangeName}
          placeholder={t_placeholder('name')}
          borderColor={GRAY.LIGHT}
          height={40}
          isRequired={true}
        />
      </InputContainer>
      {/* 권한 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('permission')}</MainText>
          <PermissionUnitList
            units={tempUnits}
            unitIds={targetPermissionTemplate.unitIds}
            onChangeUnitIds={onChangeUnitIds}
          />
        </LabelContainer>
      </InputContainer>
    </AddPermissionTemplateViewContainer>
  );
};

export default AddPermissionTemplateView;
