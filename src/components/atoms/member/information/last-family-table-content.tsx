import React, { useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { getFormattedMobilePhone } from '@/utils/format';
import { FamilyMember } from '@/models/member/member';

import { useScopedI18n } from '../../../../../locales/client';

const PhoneContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type LastFamilyTableContentProps = {
  member: FamilyMember;
  onClickEdit: (member: FamilyMember) => void;
  onClickConfirmDelete: (memberId: string) => void;
};

const LastFamilyTableContent = ({
  member,
  onClickEdit,
  onClickConfirmDelete,
}: LastFamilyTableContentProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const [isPopupShown, setIsPopupShown] = useState(false);

  const onClickDelete = () => setIsPopupShown(true);

  return (
    <PhoneContainer>
      <MainText>
        {member?.familyMember?.mobilePhone &&
          getFormattedMobilePhone(member.familyMember.mobilePhone)}
      </MainText>
      <SlideButtonList
        onClickEdit={(event) => {
          event.stopPropagation();
          onClickEdit(member);
        }}
        onClickDelete={(event) => {
          event.stopPropagation();
          onClickDelete();
        }}
        isAddShown={false}
        buttonSize={25}
        position={'relative'}
      />
      <ConfirmPopup
        title={t_popup('deleteFamilyTitle')}
        body={t_popup('deleteFamilyBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={() => onClickConfirmDelete(member.familyMemberId)}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </PhoneContainer>
  );
};

export default LastFamilyTableContent;
