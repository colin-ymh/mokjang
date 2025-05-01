import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { FAMILY, MEDIA_MIN_WIDTH } from '@/constants/constant';
import { MainText } from '@/components/atoms/common/text/main-text';
import { FamilyMember } from '@/models/member/member';
import { GRAY, WHITE } from '@/constants/styles/color';
import FamilyModal from '@/components/atoms/common/modal/family-modal';
import FamilyTable from '@/components/atoms/member/information/family-table';

import { useScopedI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';
import MobileFamilyList from '@/components/atoms/member/information/mobile/mobile-family-list';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.LIGHT};
  border-top: 1px solid ${GRAY.SEMI_LIGHT};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
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

const FamilyModalContainer = styled.div<{ $isShown: boolean }>`
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

type FamilyInformationListViewProps = {
  isModalShown: boolean;
  targetFamilyMember: FamilyMember;
  familyMembers: FamilyMember[];
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
  onClickCreateFamily: (
    familyMemberId: string,
    relation: FAMILY,
    isFetch: boolean
  ) => void;
  onClickEditFamily: (familyMemberId: string, relation: FAMILY) => void;
  onClickFamilyMember: (familyMemberId: string) => void;
  onClickEdit: (member: FamilyMember) => void;
  onClickConfirmDelete: (familyMemberId: string) => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const FamilyInformationListView = ({
  isModalShown,
  targetFamilyMember,
  familyMembers,
  onClickOpenModal,
  onClickCloseModal,
  onClickCreateFamily,
  onClickEditFamily,
  onClickFamilyMember,
  onClickConfirmDelete,
  onClickEdit,
  setIsToastShown,
}: FamilyInformationListViewProps) => {
  const t_header = useScopedI18n('header');
  return (
    <ListContainer>
      {/* 가족정보 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('familyInformation')}</MainText>
        {/* 가족 추가 버튼*/}
        <ButtonContainer onClick={onClickOpenModal}>
          <PlusButton />
        </ButtonContainer>
      </ListTypeHeader>
      {/* 가족 목록 */}
      <DesktopView>
        <FamilyTable
          familyMembers={familyMembers}
          onClickMember={onClickFamilyMember}
          onClickEdit={onClickEdit}
          onClickConfirmDelete={onClickConfirmDelete}
        />
      </DesktopView>
      <MobileView>
        <MobileFamilyList
          familyMembers={familyMembers}
          onClickMember={onClickFamilyMember}
          onClickEdit={onClickEdit}
          onClickConfirmDelete={onClickConfirmDelete}
        />
      </MobileView>
      {/* 교인 가족 추가 및 수정 모달*/}
      {isModalShown && (
        <FamilyModalContainer $isShown={isModalShown}>
          <FamilyModal
            familyMember={targetFamilyMember}
            onClickClose={onClickCloseModal}
            onClickCreateFamily={onClickCreateFamily}
            onClickEditFamily={onClickEditFamily}
            setIsToastShown={setIsToastShown}
          />
        </FamilyModalContainer>
      )}
    </ListContainer>
  );
};

export default FamilyInformationListView;
