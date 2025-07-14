import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import ManagementGroupItem from '@/components/atoms/management/group/list/management-group-item';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import Button from '@/components/atoms/common/button/button';

import { useScopedI18n } from '../../../../locales/client';

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

const GroupListContainer = styled.div`
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

type GroupListViewProps = {
  groups: Group[];
  closedGroups: Set<number>;
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  onClickToggle: (id: string) => void;
  onClickSave: () => void;
};

const RegisterGroupView = ({
  groups,
  closedGroups,
  selectedGroupId,
  setSelectedGroup,
  onClickToggle,
  onClickSave,
}: GroupListViewProps) => {
  const t_register = useScopedI18n('register');
  const t_button = useScopedI18n('button');
  return (
    <GroupContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_register('groupHeaderPhrase')}
        </MainText>
      </TextContainer>
      <GroupListContainer>
        {groups.map((group) => (
          <ManagementGroupItem
            key={group.id}
            group={group}
            level={0}
            selectedGroupId={selectedGroupId}
            setSelectedGroup={setSelectedGroup}
            closedGroups={closedGroups}
            onClickToggle={onClickToggle}
          />
        ))}
      </GroupListContainer>
      <ButtonContainer>
        <Button text={t_button('register')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </GroupContainer>
  );
};

export default RegisterGroupView;
