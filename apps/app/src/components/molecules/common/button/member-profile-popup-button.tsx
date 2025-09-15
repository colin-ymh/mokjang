import { DEFAULT_MEMBER, Member } from '@mokjang/models';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import styled from 'styled-components';
import { CustomPopup } from '@mokjang/components';
import MemberInformation from '../../../organisms/member/information/member-information';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { Svg } from '@mokjang/assets';
import MemberProfile from '../../../atoms/member/member-profile';
import { MembersApi } from '@/api/members/members.api';
import { useScopedI18n } from '../../../../../locales/client';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Cancel = styled(Svg.Cancel)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type MemberProfileButtonProps = {
  member: Member;
  isOfficerShown?: boolean;
  isProfileImageShown?: boolean;
  width?: number;
  height?: number;
};

const MemberProfilePopupButton = ({
  member,
  isOfficerShown,
  isProfileImageShown = true,
  width,
  height,
}: MemberProfileButtonProps) => {
  const t_button = useScopedI18n('button');

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
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
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
        isProfileImageShown={isProfileImageShown}
        width={width}
        height={height}
      />
      <CustomPopup
        isShow={isShow}
        onClickClose={onClickClose}
        onClickCancel={onClickClose}
        width={35}
        height={90}
        isPercentage={true}
        isPortal={true}
        isFooterShown={false}
        headerHeight={50}
      >
        <MemberInformation isPopup={true} />
      </CustomPopup>
    </>
  );
};

export default MemberProfilePopupButton;
