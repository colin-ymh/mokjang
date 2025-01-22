import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import GroupModal from '@/components/atoms/common/modal/group-modal';
import { GroupHistory } from '@/models/member/history';
import GroupHistoryItem from '@/components/atoms/member/information/group-history-item';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';

import { useI18n } from '../../../../../locales/client';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  border-top: 1px solid ${GRAY.LIGHT};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

type MemberGroupViewProps = {
  groupHistory: GroupHistory[];
  targetGroup: GroupHistory;
  isModalShown: boolean;
  onClickCloseModal: () => void;
  onClickEditGroup: (group: GroupHistory) => void;
  onClickSaveGroupHistory: (startDate?: string, endDate?: string) => void;
  onClickDeleteGroup: (groupId: string) => void;
};

const MemberGroupView = ({
  groupHistory,
  targetGroup,
  isModalShown,
  onClickCloseModal,
  onClickEditGroup,
  onClickDeleteGroup,
  onClickSaveGroupHistory,
}: MemberGroupViewProps) => {
  const t = useI18n();
  return (
    <ListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('group')}</MainText>
      </ListTypeHeader>
      {/* 이력 */}
      <GroupListContainer>
        {groupHistory.map((group) => {
          return (
            <GroupHistoryItem
              key={group.id}
              group={group}
              onClickEditGroup={onClickEditGroup}
              onClickDeleteGroup={onClickDeleteGroup}
            />
          );
        })}
      </GroupListContainer>
      {/* 그룹 추가 및 수정 모달*/}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickCloseModal}
        width={400}
        height={400}
      >
        <GroupModal
          isHistory={true}
          prevGroup={targetGroup}
          onClickSaveGroupHistory={onClickSaveGroupHistory}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default MemberGroupView;
