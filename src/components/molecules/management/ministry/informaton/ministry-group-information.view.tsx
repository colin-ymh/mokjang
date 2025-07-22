import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';
import { GRAY, WHITE } from '@/constants/styles/color';
import styled from 'styled-components';
import Plus from '../../../../../../public/svg/plus.svg';
import Setting from '../../../../../../public/svg/setting.svg';
import { Ministry, MinistryGroup } from '@/models/management/management';
import { useI18n } from '../../../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { Member } from '@/models/member/member';
import { getTranslatedAddMemberTitle } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { MEMBER } from '@/constants/column/member-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import { CHURCH_CONTENT_ID } from '@/constants/layout/content';
import EditMinistryGroup from '@/components/molecules/management/ministry/edit/edit-ministry-group';
import AddMinistryGroupMemberModal from '@/components/atoms/management/ministry/member/add-ministry-group-member-modal';
import MinistryList from '@/components/atoms/management/ministry/information/ministry-list';
import MinistryManagementMemberTable from '@/components/molecules/management/table/ministry-management-member-table';

const MinistryGroupInformationViewContainer = styled.div<{
  $isMinistryGroup: boolean;
}>`
  display: ${({ $isMinistryGroup }) => ($isMinistryGroup ? 'flex' : 'none')};
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const MinistryGroupInformationViewHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const PlusIcon = styled(Plus)`
  width: 18px;
  height: 18px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

const SettingIcon = styled(Setting)`
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

type MinistryGroupInformationViewProps = {
  selectedMinistryGroup: MinistryGroup;
  members: Member[];
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  loadMembers: () => void;
  editName: string;
  isAddModalShown: boolean;
  isEditShown: boolean;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  ministries: Ministry[];
  selectedMinistryId: string;
  onClickHeaderItem: (headerId: MEMBER) => void;
  onClickMinistryGroup: (ministryGroup: MinistryGroup) => void;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onChangeEditMinistryGroupName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeNewMinistryGroupLeaderId: (id: string) => void;
  onClickSaveEdit: () => void;
  onClickAddModalOpen: () => void;
  onClickAddModalClose: () => void;
  onClickSaveNewMembers: (selectedMembers: Member[]) => void;
  fetchMinistries: () => void;
  fetchMembers: () => void;
  onChangeMinistryItem: (id: string) => void;
};

const MinistryGroupInformationView = ({
  selectedMinistryGroup,
  isAddModalShown,
  isEditShown,
  editName,
  members,
  selectedMembers,
  setSelectedMembers,
  loadMembers,
  orderBy,
  orderDirection,
  ministries,
  selectedMinistryId,
  onClickHeaderItem,
  onClickMinistryGroup,
  onClickEditOpen,
  onClickEditClose,
  onChangeEditMinistryGroupName,
  onClickSaveEdit,
  onChangeNewMinistryGroupLeaderId,
  onClickAddModalOpen,
  onClickAddModalClose,
  onClickSaveNewMembers,
  fetchMinistries,
  fetchMembers,
  onChangeMinistryItem,
}: MinistryGroupInformationViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <>
      <MinistryGroupInformationViewContainer
        $isMinistryGroup={!!selectedMinistryGroup.id}
      >
        {/* 헤더 */}
        <MinistryGroupInformationViewHeader>
          <MainText fontSize={20} fontWeight={600}>
            {selectedMinistryGroup.name}
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
        </MinistryGroupInformationViewHeader>
        {/* 사역 */}
        <MinistryList
          ministries={ministries}
          selectedMinistryGroup={selectedMinistryGroup}
          fetchMinistries={fetchMinistries}
        />
        {/* 교인 목록 */}
        {selectedMinistryGroup.id && (
          <TableContainer>
            <MinistryManagementMemberTable
              members={members}
              type={CHURCH_CONTENT_ID.MINISTRY}
              loadMembers={loadMembers}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onClickHeaderItem={onClickHeaderItem}
              leaderMemberId={selectedMinistryGroup.leaderMemberId}
              ministries={ministries}
              fetchMembers={fetchMembers}
              fetchMinistries={fetchMinistries}
              selectedMinistryGroup={selectedMinistryGroup}
            />
          </TableContainer>
        )}
      </MinistryGroupInformationViewContainer>

      {/* 그룹 수정 팝업 */}
      <CustomPopup
        isShow={isEditShown}
        onClickCancel={onClickEditClose}
        onClickDone={onClickSaveEdit}
        headerTitle={t('title.editMinistryGroupInformation')}
        width={450}
        height={800}
      >
        <EditMinistryGroup
          members={members}
          editName={editName}
          selectedMinistryGroup={selectedMinistryGroup}
          onChangeEditMinistryGroupName={onChangeEditMinistryGroupName}
          onChangeNewMinistryGroupLeaderId={onChangeNewMinistryGroupLeaderId}
          onClickMinistryGroup={onClickMinistryGroup}
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
        headerTitle={getTranslatedAddMemberTitle(
          locale,
          selectedMinistryGroup.name
        )}
        headerDescription={t('description.addMemberHeader')}
        doneText={t('button.add')}
        onClickDone={() => onClickSaveNewMembers(selectedMembers)}
      >
        <AddMinistryGroupMemberModal
          ministryGroup={selectedMinistryGroup}
          selectedMinistryId={selectedMinistryId}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          ministries={ministries}
          onChangeMinistryItem={onChangeMinistryItem}
        />
      </CustomPopup>
    </>
  );
};

export default MinistryGroupInformationView;
