import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { DEFAULT_GROUP_HISTORY, GroupHistory } from '@/models/member/history';
import GroupHistoryItem from '@/components/atoms/member/information/group-history-item';
import MobileGroupHistoryItem from '@/components/atoms/member/information/mobile/mobile-group-history-item';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import GroupModal from '@/components/atoms/common/modal/group-modal';

import { useI18n } from '../../../../../locales/client';
import { MEDIA_MAX_WIDTH, MEDIA_MIN_WIDTH } from '@/constants/constant';

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

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding: 0;
  }
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
`;

type MemberGroupViewProps = {
  groupHistory: GroupHistory[];
  targetGroupHistory: GroupHistory;
  isModalShown: boolean;
  onClickCloseModal: () => void;
  onClickEditGroup: (group: GroupHistory) => void;
  onClickSaveGroupHistory: (startDate?: string, endDate?: string) => void;
  onClickConfirmDelete: (groupId: string) => void;
};

const MemberGroupView = ({
  groupHistory,
  targetGroupHistory,
  isModalShown,
  onClickCloseModal,
  onClickEditGroup,
  onClickConfirmDelete,
  onClickSaveGroupHistory,
}: MemberGroupViewProps) => {
  const t = useI18n();
  const currentHistory = groupHistory.find(
    (history) => history.endDate === null
  );

  return (
    <ListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('group')}</MainText>
      </ListTypeHeader>

      {/* 현재 사역 이력 */}
      {currentHistory && (
        <GroupListContainer>
          <MobileView>
            <MobileGroupHistoryItem
              group={currentHistory || DEFAULT_GROUP_HISTORY}
              onClickEditGroup={onClickEditGroup}
              onClickConfirmDelete={onClickConfirmDelete}
              isCurrent={true}
            />
          </MobileView>
          <DesktopView>
            <GroupHistoryItem
              group={currentHistory || DEFAULT_GROUP_HISTORY}
              onClickEditGroup={onClickEditGroup}
              onClickConfirmDelete={onClickConfirmDelete}
              isCurrent={true}
            />
          </DesktopView>
        </GroupListContainer>
      )}

      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('history')}</MainText>
      </ListTypeHeader>

      {/* 이력 */}
      <GroupListContainer>
        {groupHistory
          .filter((group) => group.endDate)
          .map((group) => (
            <div key={group.id}>
              <MobileView>
                <MobileGroupHistoryItem
                  key={group.id}
                  group={group}
                  onClickEditGroup={onClickEditGroup}
                  onClickConfirmDelete={onClickConfirmDelete}
                />
              </MobileView>
              <DesktopView>
                <GroupHistoryItem
                  key={group.id}
                  group={group}
                  onClickEditGroup={onClickEditGroup}
                  onClickConfirmDelete={onClickConfirmDelete}
                />
              </DesktopView>
            </div>
          ))}
      </GroupListContainer>

      {/* 그룹 추가 및 수정 모달*/}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickCloseModal}
        width={400}
        height={400}
      >
        <GroupModal
          targetHistory={targetGroupHistory}
          onClickSaveGroupHistory={onClickSaveGroupHistory}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default MemberGroupView;
