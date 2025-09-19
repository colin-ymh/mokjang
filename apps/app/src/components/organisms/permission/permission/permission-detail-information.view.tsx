import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import React from 'react';
import { MainText } from '@mokjang/components';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import PermissionUnitList from '@/components/molecules/permission/information/permission-unit-list';
import { Button } from '../../../../../../../packages/components/src';
import DeleteWarningButton from '@/components/atoms/common/button/delete-warning-button';
import { usePermissionTemplateHeaderBarItems } from '@/hooks/layout/header-bar-items';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
  overflow-y: auto;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const LineContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  height: 50px;

  border-bottom: 1px solid ${GRAY.LIGHT};
  &:last-child {
    border-bottom: none;
  }
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoxContainer = styled.div`
  display: flex;
  padding: 10px;
`;

type PermissionDetailInformationProps = {
  isEditShown: boolean;
  isEditUnit: boolean;
  onClickEditOpen: () => void;
  onClickEditUnitOpen: () => void;
  onClickEditUnitClose: () => void;
  onChangeUnits: (ids: number[]) => void;
  onClickUnitSave: () => void;
  onClickConfirmOpen: () => void;
  onClickSelectAll: () => void;
};

const PermissionDetailInformation = ({
  isEditShown,
  isEditUnit,
  onClickEditOpen,
  onClickEditUnitOpen,
  onClickEditUnitClose,
  onChangeUnits,
  onClickUnitSave,
  onClickConfirmOpen,
  onClickSelectAll,
}: PermissionDetailInformationProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  const isOwner = targetPermissionTemplate.id === 'owner';

  const headerBarItems = usePermissionTemplateHeaderBarItems();

  return (
    <InformationContainer>
      {/*<HeaderBar*/}
      {/*  value={contentId}*/}
      {/*  items={headerBarItems}*/}
      {/*  onClick={onClickHeaderBar}*/}
      {/*/>*/}
      {/* 권한 설정*/}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {`${t('permissionTemplate')}`}
          </MainText>
          {!isOwner && (
            <Button
              width={'auto'}
              text={t_button('edit')}
              borderColor={MAIN.LIGHT}
              backgroundColor={WHITE}
              color={MAIN.DEFAULT}
              height={30}
              onClick={onClickEditOpen}
            />
          )}
        </TitleContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {`${t('name')}`}
          </MainText>
          <MainText fontSize={14} fontWeight={500}>
            {targetPermissionTemplate.title}
          </MainText>
        </LineContainer>
        <LineContainer>
          <MainText fontSize={14} fontWeight={400} color={GRAY.SEMI_DARK}>
            {t('description')}
          </MainText>
          <MainText fontSize={14} fontWeight={500}>
            {targetPermissionTemplate.description}
          </MainText>
        </LineContainer>
      </LabelContainer>
      {/* 세부 권한 설정 */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {t('header.permissionUnit')}
          </MainText>
          {!isOwner &&
            (isEditUnit ? (
              <ButtonContainer>
                <Button
                  text={t_button('selectAll')}
                  color={MAIN.DEFAULT}
                  onClick={onClickSelectAll}
                  backgroundColor={WHITE}
                  fontSize={14}
                  fontWeight={400}
                  width={'auto'}
                />
                <Button
                  width={'auto'}
                  text={t_button('save')}
                  height={30}
                  onClick={onClickUnitSave}
                />
                <Button
                  width={'auto'}
                  text={t_button('cancel')}
                  borderColor={GRAY.LIGHT}
                  backgroundColor={WHITE}
                  color={GRAY.DEFAULT}
                  height={30}
                  onClick={onClickEditUnitClose}
                />
              </ButtonContainer>
            ) : (
              <Button
                width={'auto'}
                text={t_button('edit')}
                borderColor={MAIN.LIGHT}
                backgroundColor={WHITE}
                color={MAIN.DEFAULT}
                height={30}
                onClick={onClickEditUnitOpen}
              />
            ))}
        </TitleContainer>
        <PermissionUnitList
          selectedUnitIds={targetPermissionTemplate.permissionUnits.map(
            (unit) => unit.id
          )}
          isEditable={isEditUnit}
          onChangeUnitIds={onChangeUnits}
        />
      </LabelContainer>
      {/* 관리자 삭제  */}
      {!isOwner && (
        <BoxContainer>
          <DeleteWarningButton
            description={t_warning('deletePermissionTemplate')}
            buttonText={t_button('delete')}
            onClick={onClickConfirmOpen}
            disabled={targetPermissionTemplate.memberCount > 0}
          />
        </BoxContainer>
      )}
    </InformationContainer>
  );
};

export default PermissionDetailInformation;
