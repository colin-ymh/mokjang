import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { MainText } from '@mokjang/components';
import { Button } from '@mokjang/components';
import { GRAY, WHITE } from '@mokjang/constants';
import styled from 'styled-components';
import { Svg } from '@mokjang/assets';
import { Group } from '@mokjang/models';
import { useI18n } from '../../../../../../locales/client';
import { CustomPopup } from '@mokjang/components';
import EditGroup from '../edit/edit-group';
import AddGroupMemberModal from '../../../../atoms/management/group/member/add-group-member-modal';
import { Member } from '@mokjang/models';
import ManagementMemberTable from '../../table/management-member-table';
import { getTranslatedAddMemberTitle } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';
import { MEMBER } from '@mokjang/constants';
import { ORDER_DIRECTION } from '@mokjang/constants';
import { CHURCH_CONTENT_ID } from '../../../../../constants/layout/content';

const GroupInformationViewContainer = styled.div<{ $isGroup: boolean }>`
  display: ${({ $isGroup }) => ($isGroup ? 'flex' : 'none')};
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const GroupInformationViewHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const PlusIcon = styled(Svg.Plus)`
  width: 18px;
  height: 18px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

const SettingIcon = styled(Svg.Setting)`
  width: 18px;
  height: 18px;
  stroke: ${GRAY.DEFAULT};
  stroke-width: 2px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type GroupInformationViewProps = {
  selectedGroup: Group;
  members: Member[];
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  loadMembers: () => void;
  editName: string;
  isAddModalShown: boolean;
  isEditShown: boolean;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  startDate: Date | null;
  onChangeStartDate: (date: Date | null) => void;
  onClickHeaderItem: (headerId: MEMBER) => void;
  onClickGroup: (group: Group) => void;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onChangeEditGroupName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeNewGroupLeaderId: (id: string) => void;
  onClickSaveEdit: () => void;
  onClickAddModalOpen: () => void;
  onClickAddModalClose: () => void;
  onClickSaveNewMembers: (selectedMembers: Member[], startDate: Date) => void;
};

const GroupInformationView = ({
  selectedGroup,
  isAddModalShown,
  isEditShown,
  editName,
  members,
  selectedMembers,
  setSelectedMembers,
  loadMembers,
  orderBy,
  orderDirection,
  startDate,
  onChangeStartDate,
  onClickHeaderItem,
  onClickGroup,
  onClickEditOpen,
  onClickEditClose,
  onChangeEditGroupName,
  onClickSaveEdit,
  onChangeNewGroupLeaderId,
  onClickAddModalOpen,
  onClickAddModalClose,
  onClickSaveNewMembers,
}: GroupInformationViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <>
      <GroupInformationViewContainer $isGroup={!!selectedGroup.id}>
        {/* 헤더 */}
        <GroupInformationViewHeader>
          <MainText fontSize={20} fontWeight={600}>
            {selectedGroup.name}
          </MainText>
          <ButtonContainer>
            <Button
              text={t('button.edit')}
              onClick={onClickEditOpen}
              color={GRAY.SEMI_DARK}
              width={'auto'}
              height={30}
              backgroundColor={'transparent'}
              icon={<SettingIcon />}
            />
            <Button
              text={t('button.addMember')}
              onClick={onClickAddModalOpen}
              color={WHITE}
              width={'auto'}
              height={30}
              icon={<PlusIcon />}
            />
          </ButtonContainer>
        </GroupInformationViewHeader>
        {/* 컨텐츠 */}
        {selectedGroup.id && (
          <TableContainer>
            <ManagementMemberTable
              members={members}
              loadMembers={loadMembers}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onClickHeaderItem={onClickHeaderItem}
              type={CHURCH_CONTENT_ID.GROUP}
              leaderMemberId={selectedGroup.leaderMemberId}
            />
          </TableContainer>
        )}
      </GroupInformationViewContainer>

      {/* 그룹 수정 팝업 */}
      <CustomPopup
        isShow={isEditShown}
        onClickCancel={onClickEditClose}
        onClickDone={onClickSaveEdit}
        headerTitle={t('title.editGroupInformation')}
        width={450}
        height={800}
      >
        <EditGroup
          members={members}
          editName={editName}
          selectedGroup={selectedGroup}
          onChangeEditGroupName={onChangeEditGroupName}
          onChangeNewGroupLeaderId={onChangeNewGroupLeaderId}
          onClickGroup={onClickGroup}
          onClickClose={onClickEditClose}
        />
      </CustomPopup>

      {/* 교인 추가 팝업 */}
      <CustomPopup
        isShow={isAddModalShown}
        onClickCancel={onClickAddModalClose}
        width={800}
        height={700}
        headerHeight={100}
        headerTitle={getTranslatedAddMemberTitle(locale, selectedGroup.name)}
        headerDescription={t('description.addMemberHeader')}
        doneText={t('button.add')}
        doneDisabled={!startDate}
        onClickDone={() =>
          onClickSaveNewMembers(selectedMembers, startDate as Date)
        }
      >
        <AddGroupMemberModal
          group={selectedGroup}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          startDate={startDate}
          onChangeStartDate={onChangeStartDate}
        />
      </CustomPopup>
    </>
  );
};

export default GroupInformationView;
