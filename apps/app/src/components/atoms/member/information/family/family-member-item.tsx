import styled from 'styled-components';
import { MainText, ProfileImage, SvgIcon } from '@mokjang/components';
import { BLANK, FAMILY, GRAY, LOCALE, SIZE } from '@mokjang/constants';
import { getFormattedPhone } from '@mokjang/utils';
import { FamilyMember } from '@mokjang/models';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useFamilyRelationDropdownItems } from '@/hooks/dropdown/dropdown-items';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { usePathname } from 'next/navigation';
import ConfirmPopup from '../../../common/popup/error-popup';
import { MembersApi } from '@/api/members/members.api';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { Svg } from '@mokjang/assets';

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
  padding-right: 40px;
  position: relative;

  //transform-origin: center;
  //will-change: transform;
  //backface-visibility: hidden;
  &:hover {
    //transform: scale(1.02);
    //box-shadow: none;

    border-width: 2px;
  }
`;

const InformationList = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 15px;
`;

const DetailContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
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
        <InformationList>
          {/* 이미지 */}
          <ProfileImage
            value={familyMember.familyMember.profileImageUrl}
            width={50}
            height={50}
          />
          <DetailContainer>
            {/* 이름 */}
            <MainText size={SIZE.LARGE}>
              {`${familyMember.familyMember?.name} ${familyMember.familyMember?.officer?.name || BLANK}`}
            </MainText>
            {/* 연락처 */}
            <MainText color={GRAY.SEMI_DARK}>
              {getFormattedPhone(familyMember.familyMember.mobilePhone)}
            </MainText>
          </DetailContainer>
        </InformationList>

        <Dropdown
          value={familyMember.relation}
          items={familyRelationItems}
          width={100}
          height={30}
          onChangeItem={(relation: FAMILY) =>
            onChangeRelation(familyMember.familyMemberId, relation as FAMILY)
          }
        />

        <CancelButton>
          <SvgIcon
            svg={Svg.Cancel}
            size={18}
            onClick={(event) => {
              event.stopPropagation();
              onClickDelete();
            }}
          />
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
