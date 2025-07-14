import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import AddOfficerMemberModal from '@/components/atoms/management/officer/member/add-officer-member-modal';
import { GRAY } from '@/constants/styles/color';
import { Officer } from '@/models/management/management';
import { Member } from '@/models/member/member';

import { useScopedI18n } from '../../../../../../locales/client';
import Plus from '../../../../../../public/svg/plus.svg';
import { Dispatch, SetStateAction } from 'react';
import ManagementMemberTable from '@/components/molecules/management/table/management-member-table';

const OfficerMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListTypeHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  height: 40px;
  background-color: ${GRAY.EXTRA_LIGHT};
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
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
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  right: 20px;
  top: 50px;
  z-index: 100;
`;

type OfficerMemberViewProps = {
  officer: Officer;
  members: Member[];
  isModalShown: boolean;
  fetchMembers: () => void;
  onClickModalOpen: () => void;
  onClickModalClose: () => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
  loadMembers: () => void;
};

const OfficerMemberView = ({
  officer,
  members,
  isModalShown,
  fetchMembers,
  onClickModalOpen,
  onClickModalClose,
  setIsToastShown,
  loadMembers,
}: OfficerMemberViewProps) => {
  const t_header = useScopedI18n('header');

  return (
    <OfficerMemberContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('officerMembers')}</MainText>
        <MainText color={GRAY.DARK}>{`(${officer.membersCount})`}</MainText>
        <PlusButton onClick={onClickModalOpen} />
        <ModalContainer>
          <AddOfficerMemberModal
            officer={officer}
            isShown={isModalShown}
            fetchMembers={fetchMembers}
            onClickClose={onClickModalClose}
            setIsToastShown={setIsToastShown}
          />
        </ModalContainer>
      </ListTypeHeader>
      <ManagementMemberTable members={members} loadMembers={loadMembers} />
    </OfficerMemberContainer>
  );
};

export default OfficerMemberView;
