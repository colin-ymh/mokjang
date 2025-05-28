import { Member } from '@/models/member/member';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import styled from 'styled-components';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MemberInformation from '@/components/organisms/member/information/member-information';
import { BLACK } from '@/constants/styles/color';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import MemberProfile from '@/components/atoms/member/member-profile';

type MemberProfileButtonProps = {
  member: Member;
};

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

const MemberProfilePopupButton = ({ member }: MemberProfileButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isShow, setIsShow] = useState<boolean>(false);

  const onClickMember = () => {
    dispatch(setTargetMember(member));
    setIsShow(true);
  };

  const onClickClose = () => {
    setIsShow(false);
    dispatch(setTargetMember(DEFAULT_MEMBER));
  };

  return (
    <>
      <MemberProfile member={member} onClick={onClickMember} />
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
