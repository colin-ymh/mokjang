import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { FamilyMember, Member } from '@/models/member/member';
import { WHITE } from '@/constants/styles/color';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import Plus from '../../../../../../public/svg/plus.svg';
import Button from '@/components/atoms/common/button/button';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { getTranslatedFamilyAddMemberTitle } from '@/utils/translate';
import React, { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AddFamilyMemberModal from '@/components/atoms/member/information/family/add-family-member-modal';
import FamilyMemberItem from '@/components/atoms/member/information/family-member-item';
import { SIZE } from '@/constants/styles/style';
import { FAMILY } from '@/constants/constant';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const FamilyListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PlusIcon = styled(Plus)`
  width: 18px;
  height: 18px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

const FamilyList = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

type FamilyInformationListViewProps = {
  isModalShown: boolean;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  familyMembers: FamilyMember[];
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
  onClickAddDone: () => void;
  onClickConfirmDelete: (familyMemberId: string) => void;
  onChangeRelation: (memberId: string, relation: FAMILY) => void;
};

const FamilyInformationListView = ({
  isModalShown,
  familyMembers,
  selectedMembers,
  setSelectedMembers,
  onClickOpenModal,
  onClickCloseModal,
  onClickAddDone,
  onClickConfirmDelete,
  onChangeRelation,
}: FamilyInformationListViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const t_button = useScopedI18n('button');
  const t_header = useScopedI18n('header');

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  return (
    <ListContainer>
      {/* 가족정보 헤더 */}
      <FamilyListHeader>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_header('familyInformation')}
        </MainText>
        {/* 가족 추가 버튼*/}
        <Button
          width={'auto'}
          text={t_button('addFamily')}
          onClick={onClickOpenModal}
          icon={<PlusIcon />}
          height={30}
        />
      </FamilyListHeader>
      <FamilyList>
        {familyMembers.map((familyMember) => {
          return (
            <FamilyMemberItem
              key={familyMember.familyMemberId}
              familyMember={familyMember}
              onChangeRelation={onChangeRelation}
              onClickDelete={onClickConfirmDelete}
            />
          );
        })}
      </FamilyList>

      {/* 교인 추가 팝업 */}
      <CustomPopup
        isShow={isModalShown}
        onClickCancel={onClickCloseModal}
        width={800}
        height={700}
        headerHeight={100}
        headerTitle={getTranslatedFamilyAddMemberTitle(
          locale,
          targetMember.name
        )}
        headerDescription={t('description.addMemberHeader')}
        doneText={t('button.add')}
        onClickDone={onClickAddDone}
      >
        <AddFamilyMemberModal
          member={targetMember}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default FamilyInformationListView;
