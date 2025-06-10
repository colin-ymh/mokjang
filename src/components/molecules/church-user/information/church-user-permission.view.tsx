import styled from 'styled-components';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import React from 'react';
import PermissionUnitList from '@/components/molecules/permission/information/permission-unit-list';
import { CHURCH_USER_ROLE } from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { PermissionUnit } from '@/models/permission/permission';
import FakeDropdownButton from '@/components/atoms/common/button/fake-dropdown-button';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import PermissionRange from '@/components/atoms/church-user/information/permission-range';
import { getPermissionScopeTitle } from '@/utils/permission';
import { Group } from '@/models/management/management';

const PermissionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  height: 50px;
`;

type ChurchUserPermissionViewProps = {
  isGroupPopupShown: boolean;
  selectedGroupIds: (string | null)[];
  selectedPermissionTemplateId: string | null;
  selectedPermissionUnits: PermissionUnit[];
  onClickGroupPopupOpen: () => void;
  onClickGroupPopupClose: () => void;
  onChangeTemplate: (id: string | null) => void;
  onClickGroup: (group: Group) => void;
  onClickDoneGroup: () => void;
};

const ChurchUserPermissionView = ({
  isGroupPopupShown,
  selectedGroupIds,
  selectedPermissionTemplateId,
  selectedPermissionUnits,
  onClickGroupPopupOpen,
  onClickGroupPopupClose,
  onChangeTemplate,
  onClickGroup,
  onClickDoneGroup,
}: ChurchUserPermissionViewProps) => {
  const t = useI18n();
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  const isOwner = targetChurchUser.role === CHURCH_USER_ROLE.OWNER;

  const { permissionUnits, permissionTemplates } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  const permissionTemplateDropdownItems: DropdownValueType[] = [
    {
      value: null,
      title: t('none'),
    },
    ...permissionTemplates.map((template) => {
      return {
        value: template.id,
        title: template.title,
      };
    }),
  ];

  return (
    <PermissionContainer>
      <RowContainer>
        <MainText>{t('permissionScope')}</MainText>
        {isOwner ? (
          <MainText>{t('all')}</MainText>
        ) : (
          <FakeDropdownButton
            title={getPermissionScopeTitle(
              t,
              targetChurchUser.permissionScopes
            )}
            isOpened={isGroupPopupShown}
            onClick={onClickGroupPopupOpen}
            height={40}
            width={150}
            borderColor={GRAY.SEMI_LIGHT}
          />
        )}
      </RowContainer>
      <RowContainer>
        <MainText>{t('permissionTemplate')}</MainText>
        {isOwner ? (
          <MainText>{t(CHURCH_USER_ROLE.OWNER)}</MainText>
        ) : (
          <Dropdown
            value={selectedPermissionTemplateId}
            items={permissionTemplateDropdownItems}
            height={40}
            width={150}
            borderColor={GRAY.SEMI_LIGHT}
            onChangeItem={onChangeTemplate}
          />
        )}
      </RowContainer>
      <PermissionUnitList
        units={isOwner ? permissionUnits : selectedPermissionUnits}
        unitIds={
          isOwner
            ? permissionUnits.map((unit) => unit.id)
            : selectedPermissionUnits.map((unit) => unit.id)
        }
        isEditable={false}
      />
      {/* 그룹 선택 팝업 */}
      <CustomPopup
        isShow={isGroupPopupShown}
        onClickCancel={onClickGroupPopupClose}
        width={70}
        height={60}
        isPercentage={true}
        onClickDone={onClickDoneGroup}
        doneText={t('button.save')}
        isHeaderShown={false}
      >
        <PermissionRange
          selectedGroupIds={selectedGroupIds}
          onClickGroup={onClickGroup}
        />
      </CustomPopup>
    </PermissionContainer>
  );
};

export default ChurchUserPermissionView;
