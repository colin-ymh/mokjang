import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { FAMILY } from '@/constants/constant';
import { MainText } from '@/components/atoms/common/text/main-text';
import { FamilyMember } from '@/models/member/member';
import { GRAY, WHITE } from '@/constants/styles/color';
import FamilyModal from '@/components/molecules/member/information/modal/family-modal';
import FamilyMemberItem from '@/components/atoms/member/information/family-member-item';

import { useScopedI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  border-top: 1px solid ${GRAY.LIGHT};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${GRAY.LIGHT};
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

const FamilyItemListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
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
  onClickOpenModal: () => void;
  onClickCloseModal: () => void;
  onClickCreateFamily: (
    familyMemberId: string,
    relation: FAMILY,
    isFetch: boolean
  ) => void;
  onClickEditFamily: (familyMemberId: string, relation: FAMILY) => void;
  onClickFamilyMember: (familyMemberId: string) => void;
  onClickEdit: (event: React.MouseEvent, member: FamilyMember) => void;
  onClickDelete: (event: React.MouseEvent, familyMemberId: string) => void;
};

const FamilyInformationListView = ({
  isModalShown,
  targetFamilyMember,
  onClickOpenModal,
  onClickCloseModal,
  onClickCreateFamily,
  onClickEditFamily,
  onClickFamilyMember,
  onClickDelete,
  onClickEdit,
}: FamilyInformationListViewProps) => {
  const t_header = useScopedI18n('header');
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember
  );

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
      <FamilyItemListContainer>
        {targetMember.family.map((member: FamilyMember) => {
          return (
            <div key={member.familyMemberId}>
              <FamilyMemberItem
                member={member}
                onClickFamilyMember={onClickFamilyMember}
                onClickEdit={onClickEdit}
                onClickDelete={onClickDelete}
              />
              <Divider />
            </div>
          );
        })}
      </FamilyItemListContainer>
      {/* 교인 가족 추가 및 수정 모달*/}
      {isModalShown && (
        <FamilyModalContainer $isShown={isModalShown}>
          <FamilyModal
            familyMember={targetFamilyMember}
            onClickClose={onClickCloseModal}
            onClickCreateFamily={onClickCreateFamily}
            onClickEditFamily={onClickEditFamily}
          />
        </FamilyModalContainer>
      )}
    </ListContainer>
  );
};

export default FamilyInformationListView;
