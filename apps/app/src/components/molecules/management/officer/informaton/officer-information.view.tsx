import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Button, CustomPopup, MainText } from '@mokjang/components';
import {
  GRAY,
  LOCALE,
  MEMBER,
  ORDER_DIRECTION,
  WHITE,
} from '@mokjang/constants';
import styled from 'styled-components';
import { Svg } from '@mokjang/assets';
import { Member, Officer } from '@mokjang/models';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import EditOfficer from '../edit/edit-officer';
import AddOfficerMemberModal from '../../../../atoms/management/officer/member/add-officer-member-modal';
import ManagementMemberTable from '../../table/management-member-table';
import { getTranslatedAddMemberTitle } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
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
  const t_button = useScopedI18n('button');

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
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        onClickDone={onClickSaveEdit}
        headerTitle={t('title.editOfficerInformation')}
        width={450}
        height={400}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
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
        onClickClose={onClickAddModalClose}
        onClickCancel={onClickAddModalClose}
        width={500}
        height={700}
        headerHeight={100}
        headerTitle={getTranslatedAddMemberTitle(locale, selectedOfficer.name)}
        headerDescription={t('description.addMemberHeader')}
        doneText={t_button('add')}
        cancelText={t_button('cancel')}
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
