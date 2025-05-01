import Image from 'next/image';
import styled from 'styled-components';

import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getRandomImage } from '@/utils/image';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { FamilyMember } from '@/models/member/member';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import React, { useState } from 'react';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

const MemberListContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  border-top: 1px solid ${GRAY.SEMI_LIGHT};
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  gap: 10px;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  height: 50px;
  cursor: pointer;
`;

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 9px;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

type MobileFamilyListProps = {
  familyMembers: FamilyMember[];
  onClickMember: (familyMemberId: string) => void;
  onClickEdit: (member: FamilyMember) => void;
  onClickConfirmDelete: (familyMemberId: string) => void;
};

const MobileFamilyList = ({
  familyMembers,
  onClickMember,
  onClickEdit,
  onClickConfirmDelete,
}: MobileFamilyListProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const [isPopupShown, setIsPopupShown] = useState(false);

  const onClickDelete = () => setIsPopupShown(true);

  return (
    <MemberListContainer>
      {familyMembers.map((familyMember) => (
        <MemberItem
          key={familyMember.familyMemberId}
          onClick={() => onClickMember(familyMember.familyMemberId)}
        >
          <ProfileImage
            src={
              familyMember.familyMember.profileImage ||
              getRandomImage(familyMember.familyMember.id)
            }
            alt={`profileImage`}
          />
          <MemberDetails>
            <MainText fontWeight={600}>{t(familyMember.relation)}</MainText>
            <MainText>{`${familyMember.familyMember.name} ${familyMember.familyMember.officer?.name || t('churchMember')}`}</MainText>
            <MainText>{familyMember.familyMember.group?.name}</MainText>
          </MemberDetails>
          <SlideButtonList
            isAddShown={false}
            buttonSize={25}
            onClickEdit={() => onClickEdit(familyMember)}
            onClickDelete={onClickDelete}
            backgroundColor={WHITE}
            right={10}
          />
          <ConfirmPopup
            title={t_popup('deleteFamilyTitle')}
            body={t_popup('deleteFamilyBody')}
            isShow={isPopupShown}
            onClickLeftButton={() => setIsPopupShown(false)}
            onClickRightButton={() =>
              onClickConfirmDelete(familyMember.familyMemberId)
            }
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('confirm')}
            buttonNum={2}
          />
        </MemberItem>
      ))}
    </MemberListContainer>
  );
};

export default MobileFamilyList;
