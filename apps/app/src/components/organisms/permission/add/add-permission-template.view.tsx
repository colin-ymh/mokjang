import styled from 'styled-components';
import { Button, LabelInput, MainText } from '@mokjang/components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY, MAIN, SIZE, WHITE } from '@mokjang/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import PermissionUnitList from '../../../molecules/permission/information/permission-unit-list';

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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

type AddPermissionTemplateViewProps = {
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeUnitIds: (unitIds: number[]) => void;
  onClickSelectAll: () => void;
};

const AddPermissionTemplateView = ({
  onChangeName,
  onChangeDescription,
  onChangeUnitIds,
  onClickSelectAll,
}: AddPermissionTemplateViewProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const t = useI18n();
  const t_button = useScopedI18n('button');
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
        <RowContainer>
          <MainText color={GRAY.DARK} size={SIZE.SMALL}>
            {t('permission')}
          </MainText>
          <Button
            text={t_button('selectAll')}
            color={MAIN.DEFAULT}
            onClick={onClickSelectAll}
            backgroundColor={WHITE}
            fontSize={14}
            fontWeight={400}
            width={'auto'}
          />
        </RowContainer>
        <PermissionUnitList
          selectedUnitIds={targetPermissionTemplate?.unitIds || []}
          onChangeUnitIds={onChangeUnitIds}
        />
      </InputContainer>
    </AddPermissionTemplateViewContainer>
  );
};

export default AddPermissionTemplateView;
