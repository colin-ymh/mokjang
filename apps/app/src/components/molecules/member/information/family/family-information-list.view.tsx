import styled from 'styled-components';
import { Button, CustomPopup, SvgIcon } from '@mokjang/components';
import { FamilyMember, Member } from '@mokjang/models';
import { FAMILY, LOCALE, MAIN, WHITE } from '@mokjang/constants';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import { getTranslatedFamilyAddMemberTitle } from '@mokjang/utils';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AddFamilyMemberModal from '../../../../atoms/member/information/family/add-family-member-modal';
import FamilyMemberItem from '../../../../atoms/member/information/family/family-member-item';
import useWindowSize from '../../../../../hooks/window/window';
import EmptyList from '@/components/atoms/common/image/empty-list';

const ListContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0 20px;
  gap: 10px;
  height: ${({ height }) => height}px;
`;

const FamilyListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FamilyList = styled.div<{ height: number }>`
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding-bottom: 50px;
  height: ${({ height }) => height}px;
  overflow-y: auto;
`;

type FamilyInformationListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  isModalShown: boolean;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  familyMembers: FamilyMember[];
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
  onClickAddDone: () => void;
  onClickConfirmDelete: (familyMemberId: string) => void;
  onChangeRelation: (memberId: string, relation: FAMILY) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

const FamilyInformationListView = ({
  scrollRef,
  isModalShown,
  familyMembers,
  selectedMembers,
  setSelectedMembers,
  onClickOpenModal,
  onClickCloseModal,
  onClickAddDone,
  onClickConfirmDelete,
  onChangeRelation,
  onScroll,
}: FamilyInformationListViewProps) => {
  const { height } = useWindowSize();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const t_button = useScopedI18n('button');
  const t_header = useScopedI18n('header');

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  return (
    <ListContainer height={height - 300}>
      {/* 가족정보 헤더 */}
      <FamilyListHeader>
        <div />
        {/* 가족 추가 버튼*/}
        <Button
          width={'auto'}
          text={t_button('addFamily')}
          onClick={onClickOpenModal}
          icon={
            <SvgIcon svg={Svg.Plus} color={MAIN.DEFAULT} width={2} size={18} />
          }
          height={30}
          backgroundColor={WHITE}
          color={MAIN.DEFAULT}
        />
      </FamilyListHeader>
      <FamilyList ref={scrollRef} onScroll={onScroll} height={height - 400}>
        {familyMembers.length > 0 ? (
          familyMembers.map((familyMember) => {
            return (
              <FamilyMemberItem
                key={familyMember.familyMemberId}
                familyMember={familyMember}
                onChangeRelation={onChangeRelation}
                onClickConfirmDelete={onClickConfirmDelete}
              />
            );
          })
        ) : (
          <EmptyList size={50} />
        )}
      </FamilyList>

      {/* 교인 추가 팝업 */}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickCloseModal}
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
        cancelText={t('button.cancel')}
        onClickDone={onClickAddDone}
      >
        <AddFamilyMemberModal
          familyMembers={familyMembers}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default FamilyInformationListView;
