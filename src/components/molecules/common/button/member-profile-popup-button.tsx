import { DEFAULT_MEMBER, Member } from '@/models/member/member';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import styled from 'styled-components';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MemberInformation from '@/components/organisms/member/information/member-information';
import { BLACK } from '@/constants/styles/color';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import MemberProfile from '@/components/atoms/member/member-profile';
import { MembersApi } from '@/api/members/members.api';

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type MemberProfileButtonProps = {
  member: Member;
  isOfficerShown?: boolean;
  isGroupLeaderShown?: boolean;
};

const MemberProfilePopupButton = ({
  member,
  isOfficerShown,
  isGroupLeaderShown,
}: MemberProfileButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const [isShow, setIsShow] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickMember = async () => {
    try {
      const membersApi = new MembersApi(false);
      const response = await membersApi.getMember({
        churchId,
        memberId: member.id,
      });
      const newMember = response.data.data;
      dispatch(setTargetMember(newMember));
      setIsShow(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickClose = () => {
    setIsShow(false);
    dispatch(setTargetMember(DEFAULT_MEMBER));
  };

  return (
    <>
      <MemberProfile
        member={member}
        onClick={onClickMember}
        isOfficerShown={isOfficerShown}
        isGroupLeaderShown={isGroupLeaderShown}
      />
      <CustomPopup
        isShow={isShow}
        onClickCancel={onClickClose}
        width={80}
        height={80}
        isPercentage={true}
        isPortal={true}
        isFooterShown={false}
        headerRight={
          <ButtonContainer onClick={onClickClose}>
            <Cancel />
          </ButtonContainer>
        }
      >
        <MemberInformation isPopup={true} />
      </CustomPopup>
    </>
  );
};

export default MemberProfilePopupButton;
