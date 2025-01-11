import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import GroupModal from '@/components/atoms/modal/group-modal';
import { GroupHistory } from '@/models/member/history';

import { useI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';
import GroupHistoryItem from '@/components/atoms/member/information/group-history-item';

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

const ButtonContainer = styled.div`
  display: flex;
  background-color: ${GRAY.DEFAULT};
  border-radius: 5px;
  cursor: pointer;
`;

const PlusButton = styled(Plus)`
  stroke: ${WHITE};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
`;

const ModalContainer = styled.div<{ $isShown: boolean }>`
  //display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  display: flex;
  position: absolute;

  z-index: 200;
  background-color: ${WHITE};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  right: 10px;
  top: 40px;
`;

type MemberGroupViewProps = {
  groupHistory: GroupHistory[];
  targetGroup: GroupHistory;
  isModalShown: boolean;
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
  onClickEditGroup: (group: GroupHistory) => void;
  onClickSaveNewGroup: (groupId: string, startDate: string) => void;
  onClickSaveEditGroup: (startDate?: string, endDate?: string) => void;
  onClickDeleteGroup: (groupId: string) => void;
};

const MemberGroupView = ({
  groupHistory,
  targetGroup,
  isModalShown,
  onClickOpenModal,
  onClickCloseModal,
  onClickEditGroup,
  onClickSaveNewGroup,
  onClickSaveEditGroup,
  onClickDeleteGroup,
}: MemberGroupViewProps) => {
  const t = useI18n();
  return (
    <ListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('group')}</MainText>
        {/* 그룹 추가 버튼*/}
        <ButtonContainer onClick={onClickOpenModal}>
          <PlusButton />
        </ButtonContainer>
      </ListTypeHeader>
      {/* 이력 */}
      <GroupListContainer>
        {groupHistory.map((group) => {
          return (
            <GroupHistoryItem
              group={group}
              onClickEditGroup={onClickEditGroup}
              onClickDeleteGroup={onClickDeleteGroup}
            />
          );
        })}
      </GroupListContainer>
      {/* 그룹 추가 및 수정 모달*/}
      {isModalShown && (
        <ModalContainer $isShown={isModalShown}>
          <GroupModal
            prevGroup={targetGroup}
            onClickClose={onClickCloseModal}
            onClickSaveNewGroup={onClickSaveNewGroup}
            onClickSaveEditGroup={onClickSaveEditGroup}
          />
        </ModalContainer>
      )}
    </ListContainer>
  );
};

export default MemberGroupView;
