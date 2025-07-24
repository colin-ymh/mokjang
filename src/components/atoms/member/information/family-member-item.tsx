import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { MEMBER } from '@/constants/column/member-column';
import { getFormattedMobilePhone } from '@/utils/format';
import { FamilyMember } from '@/models/member/member';
import { useI18n } from '../../../../../locales/client';
import ProfileImage from '@/components/atoms/common/image/profile-image';
import { SIZE } from '@/constants/styles/style';
import Phone from '../../../../../public/svg/phone.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import { BLANK, FAMILY } from '@/constants/constant';
import { useFamilyRelationDropdownItems } from '@/hooks/dropdown/dropdown-items';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import TagDropdownButton from '@/components/atoms/common/dropdown/tag-dropdown-button';
import React, { useState } from 'react';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

const ItemContainer = styled.div`
  display: flex;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${GRAY.LIGHT};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const InformationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MemberInformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

type FamilyMemberItemProps = {
  familyMember: FamilyMember;
  onChangeRelation: (memberId: string, relation: FAMILY) => void;
  onClickDelete: (familyMemberId: string) => void;
};

const FamilyMemberItem = ({
  familyMember,
  onChangeRelation,
  onClickDelete,
}: FamilyMemberItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();

  const familyRelationItems = useFamilyRelationDropdownItems(
    familyMember.familyMember.gender
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickMember = async () => {
    try {
      dispatch(setTargetMember(familyMember.familyMember));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <>
      <ItemContainer onClick={onClickMember}>
        <LeftContainer>
          {/* 이미지 */}
          <ProfileImage value={familyMember.familyMember.profileImageUrl} />
          <InformationList>
            {/* 이름 */}
            <MemberInformationContainer>
              <MainText size={SIZE.LARGE}>
                {familyMember.familyMember?.name}
              </MainText>
              <MainText
                color={GRAY.SEMI_DARK}
              >{`${familyMember.familyMember?.officer?.name || BLANK}`}</MainText>
            </MemberInformationContainer>
            {/* 나이 */}
            <MemberInformationContainer>
              {/* 연락처 */}
              <SvgIcon svg={Phone} color={GRAY.SEMI_DARK} />
              <MainText color={GRAY.SEMI_DARK}>
                {t(MEMBER.MOBILE_PHONE)}
              </MainText>
              <MainText>
                {getFormattedMobilePhone(familyMember.familyMember.mobilePhone)}
              </MainText>
            </MemberInformationContainer>
          </InformationList>
        </LeftContainer>
        <Dropdown
          value={familyMember.relation}
          items={familyRelationItems}
          width={100}
          CustomDropdownButton={TagDropdownButton}
          onChangeItem={(relation) =>
            onChangeRelation(familyMember.familyMemberId, relation as FAMILY)
          }
        />
      </ItemContainer>
    </>
  );
};

export default FamilyMemberItem;
