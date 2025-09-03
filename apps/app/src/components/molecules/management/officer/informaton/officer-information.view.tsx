import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { MainText } from '../../../../atoms/common/text/main-text';
import Button from '../../../../atoms/common/button/button';
import { GRAY, WHITE } from '../../../../../constants/styles/color';
import styled from 'styled-components';
import Plus from '../../../../../../public/svg/plus.svg';
import Setting from '../../../../../../public/svg/setting.svg';
import { Officer } from '../../../../../models/management/management';
import { useI18n } from '../../../../../../locales/client';
import CustomPopup from '../../../../atoms/common/popup/custom-popup';
import EditOfficer from '../edit/edit-officer';
import AddOfficerMemberModal from '../../../../atoms/management/officer/member/add-officer-member-modal';
import { Member } from '../../../../../models/member/member';
import ManagementMemberTable from '../../table/management-member-table';
import { getTranslatedAddMemberTitle } from '../../../../../utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../../constants/state/locale';
import { MEMBER } from '../../../../../constants/column/member-column';
import { ORDER_DIRECTION } from '../../../../../constants/constant';
import { CHURCH_CONTENT_ID } from '../../../../../constants/layout/content';

const OfficerInformationViewContainer = styled.div<{ $isOfficer: boolean }>`
  display: ${({ $isOfficer }) => ($isOfficer ? 'flex' : 'none')};
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const OfficerInformationViewHeader = styled.div`
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

type OfficerInformationViewProps = {
  selectedOfficer: Officer;
  members: Member[];
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  loadMembers: () => void;
  editName: string;
  isAddModalShown: boolean;
  isEditShown: boolean;
  startDate: Date | null;
  onChangeStartDate: (date: Date | null) => void;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  onClickHeaderItem: (headerId: MEMBER) => void;
  onClickOfficer: (officer: Officer) => void;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onChangeEditOfficerName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveEdit: () => void;
  onClickAddModalOpen: () => void;
  onClickAddModalClose: () => void;
  onClickSaveNewMembers: (selectedMembers: Member[], startDate: Date) => void;
};

const OfficerInformationView = ({
  selectedOfficer,
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
  onClickOfficer,
  onClickEditOpen,
  onClickEditClose,
  onChangeEditOfficerName,
  onClickSaveEdit,
  onClickAddModalOpen,
  onClickAddModalClose,
  onClickSaveNewMembers,
}: OfficerInformationViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <>
      <OfficerInformationViewContainer $isOfficer={!!selectedOfficer.id}>
        {/* 헤더 */}
        <OfficerInformationViewHeader>
          <MainText fontSize={20} fontWeight={600}>
            {selectedOfficer.name}
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
        </OfficerInformationViewHeader>
        {/* 컨텐츠 */}
        {selectedOfficer.id && (
          <TableContainer>
            <ManagementMemberTable
              members={members}
              loadMembers={loadMembers}
              type={CHURCH_CONTENT_ID.OFFICER}
              orderBy={orderBy}
              orderDirection={orderDirection}
              onClickHeaderItem={onClickHeaderItem}
            />
          </TableContainer>
        )}
      </OfficerInformationViewContainer>

      {/* 직분 수정 팝업 */}
      <CustomPopup
        isShow={isEditShown}
        onClickCancel={onClickEditClose}
        onClickDone={onClickSaveEdit}
        headerTitle={t('title.editOfficerInformation')}
        width={450}
        height={400}
      >
        <EditOfficer
          editName={editName}
          selectedOfficer={selectedOfficer}
          onChangeEditOfficerName={onChangeEditOfficerName}
          onClickOfficer={onClickOfficer}
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
        headerTitle={getTranslatedAddMemberTitle(locale, selectedOfficer.name)}
        headerDescription={t('description.addMemberHeader')}
        doneText={t('button.add')}
        onClickDone={() =>
          onClickSaveNewMembers(selectedMembers, startDate as Date)
        }
      >
        <AddOfficerMemberModal
          officer={selectedOfficer}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          startDate={startDate}
          onChangeStartDate={onChangeStartDate}
        />
      </CustomPopup>
    </>
  );
};

export default OfficerInformationView;
