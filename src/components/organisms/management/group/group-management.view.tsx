import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import GroupList from '@/components/molecules/management/group/group-list';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { GROUP_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import HeaderBar, {
  HeaderBarItem,
} from '@/components/atoms/layout/header/header-bar';
import { getGroupManagementContent } from '@/hooks/layout/render-layout';
import { Group } from '@/models/management/management';

import { useI18n } from '../../../../../locales/client';

const GroupManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.LIGHT};
  width: 200px;
  flex-shrink: 0;
`;

const GroupInformationContainer = styled.div<{ $isGroup: boolean }>`
  display: ${({ $isGroup }) => ($isGroup ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
`;

const GroupInformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${GRAY.LIGHT};
  gap: 10px;
  padding: 20px 20px 0 20px;
`;

type GroupManagementViewProps = {
  selectedGroup: Group;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  headerBarId: string;
  headerBarItems: HeaderBarItem[];
  onClickHeaderBar: (id: GROUP_MANAGEMENT_HEADER_ID) => void;
};

const GroupManagementView = ({
  selectedGroup,
  setSelectedGroup,
  headerBarId,
  headerBarItems,
  onClickHeaderBar,
}: GroupManagementViewProps) => {
  const t = useI18n();
  return (
    <GroupManagementContainer>
      {/* 그룹 목록 */}
      <GroupListContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {t('groupList')}
        </MainText>
        <GroupList
          selectedGroupId={selectedGroup.id}
          setSelectedGroup={setSelectedGroup}
        />
      </GroupListContainer>
      {/* 교회 정보 */}
      <GroupInformationContainer $isGroup={!!selectedGroup.id}>
        {/* 헤더 */}
        <GroupInformationHeader>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {selectedGroup.name}
          </MainText>
          <HeaderBar
            value={headerBarId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        </GroupInformationHeader>
        {/* 컨텐츠 */}
        {getGroupManagementContent(headerBarId, selectedGroup)}
      </GroupInformationContainer>
    </GroupManagementContainer>
  );
};

export default GroupManagementView;
