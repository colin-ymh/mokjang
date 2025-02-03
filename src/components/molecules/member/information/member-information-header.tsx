import React, { useState } from 'react';
import styled from 'styled-components';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';
import { useMemberInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';
import MemberImageInput from '@/components/atoms/register/member-image-input';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { Member } from '@/models/member/member';
import KebapDropdown from '@/components/atoms/common/dropdown/kebap-dropdown';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  gap: 30px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
`;

const ChurchMemberInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

type MemberInformationHeaderProps = {
  targetMember: Member;
  contentId: string;
  onClickItem: (id: string) => void;
  onClickDelete: () => void;
};

const MemberInformationHeader = ({
  targetMember,
  contentId,
  onClickItem,
  onClickDelete,
}: MemberInformationHeaderProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const headerBarItems = useMemberInformationHeaderBarItems();

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickOpen = () => {
    setIsPopupShown(true);
  };

  const onClickClose = () => {
    setIsPopupShown(false);
  };

  return (
    <InformationHeader>
      <Information>
        <MemberImageInput
          value={targetMember?.profileImage}
          onChange={() => {}}
          width={80}
          height={80}
        />
        <TextContainer>
          <MainText size={SIZE.LARGE}>{targetMember.name}</MainText>
          <ChurchMemberInfoContainer>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember?.officer?.name}
            </MainText>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember.group &&
                targetMember.group?.name &&
                targetMember?.officer?.name &&
                'ㆍ'}
            </MainText>
            <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
              {targetMember.group?.name}
            </MainText>
          </ChurchMemberInfoContainer>
        </TextContainer>

        <KebapDropdown
          buttonSize={30}
          top={0}
          right={-10}
          onClickDelete={onClickOpen}
        />

        <ConfirmPopup
          title={t_popup('deleteMemberTitle')}
          body={t_popup('deleteMemberContent')}
          buttonNum={2}
          isShow={isPopupShown}
          onClickLeftButton={onClickClose}
          onClickRightButton={onClickDelete}
          leftButtonText={t_button('cancel')}
          rightButtonText={t_button('delete')}
        />
      </Information>

      {/* 개인정보, 가족 등의 탭 바*/}
      <HeaderBarView
        value={contentId}
        items={headerBarItems}
        onClick={onClickItem}
      />
    </InformationHeader>
  );
};

export default MemberInformationHeader;
