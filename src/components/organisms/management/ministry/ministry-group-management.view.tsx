import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { MINISTRY_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import HeaderBar, {
  HeaderBarItem,
} from '@/components/atoms/layout/header/header-bar';
import { getMinistryGroupManagementContent } from '@/hooks/layout/render-layout';
import { MinistryGroup } from '@/models/management/management';
import MinistryGroupList from '@/components/molecules/management/ministry/ministry-group-list';

import { useI18n } from '../../../../../locales/client';

const MinistryManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const MinistryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.LIGHT};
  width: 200px;
  flex-shrink: 0;
`;

const MinistryInformationContainer = styled.div<{ $isMinistry: boolean }>`
  display: ${({ $isMinistry }) => ($isMinistry ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
`;

const MinistryInformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${GRAY.LIGHT};
  gap: 10px;
  padding: 20px 20px 0 20px;
`;

type MinistryManagementViewProps = {
  ministryGroups: MinistryGroup[];
  selectedMinistryGroup: MinistryGroup;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
  headerBarId: string;
  headerBarItems: HeaderBarItem[];
  onClickHeaderBar: (id: MINISTRY_MANAGEMENT_HEADER_ID) => void;
  fetchMinistryGroups: () => void;
};

const MinistryManagementView = ({
  ministryGroups,
  selectedMinistryGroup,
  setSelectedMinistryGroup,
  headerBarId,
  headerBarItems,
  onClickHeaderBar,
  fetchMinistryGroups,
}: MinistryManagementViewProps) => {
  const t = useI18n();
  return (
    <MinistryManagementContainer>
      {/* 그룹 목록 */}
      <MinistryListContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {t('ministryGroupList')}
        </MainText>
        <MinistryGroupList
          ministryGroups={ministryGroups}
          selectedMinistryGroupId={selectedMinistryGroup.id}
          setSelectedMinistryGroup={setSelectedMinistryGroup}
          fetchMinistryGroups={fetchMinistryGroups}
        />
      </MinistryListContainer>
      {/* 교회 정보 */}
      <MinistryInformationContainer $isMinistry={!!selectedMinistryGroup.id}>
        {/* 헤더 */}
        <MinistryInformationHeader>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {selectedMinistryGroup.name}
          </MainText>
          <HeaderBar
            value={headerBarId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        </MinistryInformationHeader>
        {/* 컨텐츠 */}
        {getMinistryGroupManagementContent(
          headerBarId,
          selectedMinistryGroup,
          fetchMinistryGroups
        )}
      </MinistryInformationContainer>
    </MinistryManagementContainer>
  );
};

export default MinistryManagementView;
