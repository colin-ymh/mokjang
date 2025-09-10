import styled from 'styled-components';

import { Svg } from '@mokjang/assets';
import { MainText, SvgIcon } from '@mokjang/components';
import { BLANK, FAMILY, GRAY, LOCALE, MEMBER, SIZE } from '@mokjang/constants';
import {
  getAge,
  getDateFromDateString,
  getFormattedMobilePhone,
  getTranslatedAge,
} from '@mokjang/utils';
import { FamilyMember } from '@mokjang/models';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import ProfileImage from '../../../common/image/profile-image';
import { useFamilyRelationDropdownItems } from '../../../../../hooks/dropdown/dropdown-items';
import Dropdown from '../../../common/dropdown/dropdown';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { usePathname } from 'next/navigation';
import ConfirmPopup from '../../../common/popup/error-popup';
import { MembersApi } from '../../../../../api/members/members.api';
import { setTargetMember } from '../../../../../redux/reducers/target/target-member-reducer';

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
  position: relative;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const NameContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: row;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 80px;
  gap: 13px;
`;

const InformationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const MemberInformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 13px;
`;

const CancelButton = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

type FamilyMemberItemProps = {
  familyMember: FamilyMember;
  onChangeRelation: (memberId: string, relation: FAMILY) => void;
  onClickConfirmDelete: (familyMemberId: string) => void;
};

const FamilyMemberItem = ({
  familyMember,
  onChangeRelation,
  onClickConfirmDelete,
}: FamilyMemberItemProps) => {
  // 로케일 코드
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();

  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  const { churchId } = useSelector((state: RootState) => state.church);

  const membersApi = new MembersApi(false);

  const [isDeleteShown, setIsDeleteShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickDelete = () => {
    setIsDeleteShown(true);
  };

  const onClickCancelDelete = () => {
    setIsDeleteShown(false);
  };

  const familyRelationItems = useFamilyRelationDropdownItems(
    familyMember.familyMember.gender
  );

  const onClickMember = async () => {
    try {
      const response = await membersApi.getMember({
        churchId,
        memberId: familyMember.familyMemberId,
      });
      const newMember = response.data.data;
      dispatch(setTargetMember(newMember));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  return (
    <>
      <ItemContainer onClick={onClickMember}>
        <LeftContainer>
          {/* 이미지 */}

          <InformationList>
            {/* 이름 */}
            <MemberInformationContainer>
              <ProfileImage value={familyMember.familyMember.profileImageUrl} />
              <NameContainer>
                <MainText size={SIZE.LARGE}>
                  {`${familyMember.familyMember?.name}`}
                </MainText>
                <MainText color={GRAY.DEFAULT}>
                  {`${familyMember.familyMember?.officer?.name || BLANK}`}
                </MainText>
              </NameContainer>
            </MemberInformationContainer>
            <DetailContainer>
              {/* 나이 */}
              <MemberInformationContainer>
                <TitleContainer>
                  <SvgIcon svg={Svg.Calendar} color={GRAY.DARK} />
                  <MainText color={GRAY.DARK}>{t(MEMBER.AGE)}</MainText>
                </TitleContainer>
                <MainText>
                  {getTranslatedAge(
                    locale,
                    getAge(
                      getDateFromDateString(familyMember.familyMember.birth)
                    )
                  )}
                </MainText>
              </MemberInformationContainer>
              {/* 연락처 */}
              <MemberInformationContainer>
                <TitleContainer>
                  <SvgIcon svg={Svg.Phone} color={GRAY.DARK} />
                  <MainText color={GRAY.DARK}>
                    {t(MEMBER.MOBILE_PHONE)}
                  </MainText>
                </TitleContainer>
                <MainText>
                  {getFormattedMobilePhone(
                    familyMember.familyMember.mobilePhone
                  )}
                </MainText>
              </MemberInformationContainer>
            </DetailContainer>
          </InformationList>
        </LeftContainer>
        <Dropdown
          value={familyMember.relation}
          items={familyRelationItems}
          width={100}
          height={30}
          onChangeItem={(relation: FAMILY) =>
            onChangeRelation(familyMember.familyMemberId, relation as FAMILY)
          }
        />

        {/* 삭제 */}
        <CancelButton
          onClick={(event) => {
            event.stopPropagation();
            onClickDelete();
          }}
        >
          <SvgIcon svg={Svg.Cancel} size={18} />
        </CancelButton>
      </ItemContainer>

      {/* 가족 삭제 팝업 */}
      <ConfirmPopup
        title={t_popup('deleteFamilyTitle')}
        body={t_popup('deleteFamilyBody')}
        isShow={isDeleteShown}
        onClickLeftButton={onClickCancelDelete}
        onClickRightButton={() =>
          onClickConfirmDelete(familyMember.familyMemberId)
        }
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </>
  );
};

export default FamilyMemberItem;
