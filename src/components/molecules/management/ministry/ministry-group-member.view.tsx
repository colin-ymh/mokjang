import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { MinistryGroup } from '@/models/management/management';
import { Member } from '@/models/member/member';
import MinistryGroupMemberTable from '@/components/molecules/management/ministry/ministry-group-member-table';
import AddMinistryGroupMemberModal from '@/components/atoms/common/modal/add-ministry-group-member-modal';

import { useScopedI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';

const MinistryGroupMemberContainer = styled.div`
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

type MinistryGroupMemberViewProps = {
  ministryGroup: MinistryGroup;
  members: Member[];
  isModalShown: boolean;
  fetchMembers: () => void;
  onClickModalOpen: () => void;
  onClickModalClose: () => void;
};

const MinistryGroupMemberView = ({
  ministryGroup,
  members,
  isModalShown,
  fetchMembers,
  onClickModalOpen,
  onClickModalClose,
}: MinistryGroupMemberViewProps) => {
  const t_header = useScopedI18n('header');

  return (
    <MinistryGroupMemberContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>
          {t_header('ministryGroupMembers')}
        </MainText>
        {/*<PlusButton onClick={onClickModalOpen} />*/}
        <ModalContainer>
          <AddMinistryGroupMemberModal
            ministryGroup={ministryGroup}
            isShown={isModalShown}
            fetchMembers={fetchMembers}
            onClickClose={onClickModalClose}
          />
        </ModalContainer>
      </ListTypeHeader>
      <MinistryGroupMemberTable ministryGroupMembers={members} />
    </MinistryGroupMemberContainer>
  );
};

export default MinistryGroupMemberView;
