import React, { ChangeEvent, Dispatch, LegacyRef, SetStateAction } from 'react';
import styled from 'styled-components';

import { GroupRole } from '@/models/management/management';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import Button from '@/components/atoms/common/button/button';
import ManagementRoleItem from '@/components/atoms/management/group/management-role-item';
import LabelInput from '@/components/atoms/common/input/label-input';
import AddRole from '@/components/atoms/management/group/add-role';

import { useI18n, useScopedI18n } from '../../../../../locales/client';

const GroupContainer = styled.div`
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

const GroupRolesListContainer = styled.div`
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

type GroupListViewProps = {
  newRoleRef: LegacyRef<HTMLInputElement>;
  newName: string;
  newRoleName: string;
  roles: GroupRole[];
  selectedRoleId: string | null;
  setRoles: Dispatch<SetStateAction<GroupRole[]>>;
  setSelectedRole: Dispatch<SetStateAction<GroupRole>>;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeNewRoleName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSave: () => void;
  onClickSaveNewRole: () => void;
};

const EditGroupView = ({
  newRoleRef,
  newName,
  newRoleName,
  roles,
  selectedRoleId,
  setRoles,
  setSelectedRole,
  onChangeName,
  onChangeNewRoleName,
  onClickSave,
  onClickSaveNewRole,
}: GroupListViewProps) => {
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');
  const t = useI18n();
  return (
    <GroupContainer>
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
      <GroupRolesListContainer>
        <MainText>{t('groupRole')}</MainText>
        {roles.map((role) => (
          <ManagementRoleItem
            key={role.id}
            role={role}
            roles={roles}
            setRoles={setRoles}
            selectedRoleId={selectedRoleId}
            setSelectedRole={setSelectedRole}
          />
        ))}
        <AddRole
          ref={newRoleRef}
          name={newRoleName}
          onChangeName={onChangeNewRoleName}
          onClickSaveRole={onClickSaveNewRole}
          isShown={true}
        />
      </GroupRolesListContainer>
      <ButtonContainer>
        <Button text={t_button('edit')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </GroupContainer>
  );
};

export default EditGroupView;
