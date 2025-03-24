import styled from 'styled-components';

import GroupMemberTable from '@/components/molecules/management/group/group-member-table';
import { MainText } from '@/components/atoms/common/text/main-text';
import AddGroupMemberModal from '@/components/atoms/common/modal/add-group-member-modal';
import { GRAY } from '@/constants/styles/color';
import { Group } from '@/models/management/management';
import { Member } from '@/models/member/member';

import { useScopedI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';
import { Dispatch, SetStateAction } from 'react';

const GroupMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListTypeHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
`;

const PlusButton = styled(Plus)`
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  right: 20px;
  top: 50px;
  z-index: 100;
`;

type GroupMemberViewProps = {
  group: Group;
  members: Member[];
  isModalShown: boolean;
  fetchMembers: () => void;
  onClickModalOpen: () => void;
  onClickModalClose: () => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const GroupMemberView = ({
  group,
  members,
  isModalShown,
  fetchMembers,
  onClickModalOpen,
  onClickModalClose,
  setIsToastShown,
}: GroupMemberViewProps) => {
  const t_header = useScopedI18n('header');

  return (
    <GroupMemberContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('groupMembers')}</MainText>
        <MainText color={GRAY.DARK}>{`(${group.membersCount})`}</MainText>
        <PlusButton onClick={onClickModalOpen} />
        <ModalContainer>
          <AddGroupMemberModal
            group={group}
            isShown={isModalShown}
            fetchMembers={fetchMembers}
            onClickClose={onClickModalClose}
            setIsToastShown={setIsToastShown}
          />
        </ModalContainer>
      </ListTypeHeader>
      <GroupMemberTable groupMembers={members} />
    </GroupMemberContainer>
  );
};

export default GroupMemberView;
