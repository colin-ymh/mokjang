import { DEFAULT_MEMBER, Member } from '@mokjang/models';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { setTargetMember } from '../../../../redux/reducers/target/target-member-reducer';
import styled from 'styled-components';
import { CustomPopup } from '@mokjang/components';
import MemberInformation from '../../../organisms/member/information/member-information';
import { BLACK } from '@mokjang/constants';
import { Svg } from '@mokjang/assets';
import MemberProfile from '../../../atoms/member/member-profile';
import { MembersApi } from '../../../../api/members/members.api';
import { useScopedI18n } from '../../../../../locales/client';

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
        isProfileImageShown={isProfileImageShown}
        width={width}
        height={height}
      />
      <CustomPopup
        isShow={isShow}
        onClickCancel={onClickClose}
        width={80}
        height={80}
        isPercentage={true}
        isPortal={true}
        isFooterShown={false}
        headerHeight={50}
        headerRight={
          <ButtonContainer onClick={onClickClose}>
            <Cancel />
          </ButtonContainer>
        }
        cancelText={t_button('close')}
      >
        <MemberInformation isPopup={true} />
      </CustomPopup>
    </>
  );
};

export default MemberProfilePopupButton;
