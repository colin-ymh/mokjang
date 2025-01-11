import { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, DESTRUCTIVE, GRAY } from '@/constants/styles/color';
import { MEMBER } from '@/constants/member/member-column';
import { getAge } from '@/utils/date';
import { GENDER } from '@/constants/constant';
import { getFormattedMobilePhone } from '@/utils/format';
import { FamilyMember } from '@/models/member/member';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';

import DefaultImage from '../../../../../public/png/default-member-image.png';
import Kebab from '../../../../../public/svg/kebab.svg';
import { useI18n } from '../../../../../locales/client';
import { getCurrentGroup } from '@/utils/history';

const ItemContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
  border-radius: 5px;
  position: relative;
  cursor: pointer;

  transition: background-color 0.3s;
  // &:hover {
  //   background-color: ${GRAY.LIGHT};
  // }
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-left: 5px;
`;

const MemberInformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 20px;
  min-width: 100px;
`;

const KebabButton = styled(Kebab)`
  position: absolute;
  stroke: ${BLACK};
  width: 25px;
  height: 25px;
  right: 0;
`;

const ModalContainer = styled.div`
  display: flex;
  position: absolute;
  right: -10px;
  top: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  background-color: ${GRAY.BACKGROUND};
  width: 100px;
  padding: 5px;
  border-radius: 5px;
  flex-direction: column;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.15);
  z-index: 50;
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  border-radius: 5px;
  padding: 10px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type FamilyMemberItemProps = {
  member: FamilyMember;
  onClickFamilyMember: (familyMemberId: string) => void;
  onClickEdit: (member: FamilyMember) => void;
  onClickDelete: (familyMemberId: string) => void;
};

const FamilyMemberItem = ({
  member,
  onClickFamilyMember,
  onClickEdit,
  onClickDelete,
}: FamilyMemberItemProps) => {
  const t = useI18n();

  // 수정, 삭제 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 모달 열기
  const onClickKebab = () => {
    setIsModalShown(true);
  };

  // 모달 닫기
  const onClickClose = () => {
    setIsModalShown(false);
  };

  return (
    <ItemContainer onClick={() => onClickFamilyMember(member.familyMemberId)}>
      {/* 관계 */}
      <MemberInformationContainer>
        <MainText fontWeight={600}>{t(member.relation)}</MainText>
      </MemberInformationContainer>
      {/* 이미지 */}
      <ProfileImage src={DefaultImage} alt={'profileImage'} />
      {/* 이름 */}
      <MemberInformationContainer>
        <MainText color={GRAY.DEFAULT}>{t(MEMBER.NAME)}</MainText>
        <MainText>{member.familyMember.name}</MainText>
      </MemberInformationContainer>
      {/* 나이 */}
      <MemberInformationContainer>
        <MainText color={GRAY.DEFAULT}>{t(MEMBER.AGE)}</MainText>
        {member?.familyMember?.birth && (
          <MainText>{getAge(new Date(member.familyMember.birth))}</MainText>
        )}
      </MemberInformationContainer>
      {/* 성볋 */}
      <MemberInformationContainer>
        <MainText color={GRAY.DEFAULT}>{t(MEMBER.GENDER)}</MainText>
        <MainText>{t(member.familyMember.gender as GENDER)}</MainText>
      </MemberInformationContainer>
      {/* 직분 */}
      <MemberInformationContainer>
        <MainText color={GRAY.DEFAULT}>{t(MEMBER.OFFICER)}</MainText>
        <MainText>{member.familyMember?.officer?.name}</MainText>
      </MemberInformationContainer>
      {/* 소그룹 */}
      <MemberInformationContainer>
        <MainText color={GRAY.DEFAULT}>{t(MEMBER.GROUP)}</MainText>
        <MainText>
          {member.familyMember?.group &&
            getCurrentGroup(member.familyMember?.group)?.groupName}
        </MainText>
      </MemberInformationContainer>
      {/* 전화번호 */}
      <MemberInformationContainer>
        <MainText color={GRAY.DEFAULT}>{t(MEMBER.MOBILE_PHONE)}</MainText>
        <MainText>
          {getFormattedMobilePhone(member.familyMember.mobilePhone)}
        </MainText>
      </MemberInformationContainer>
      {/* 우측 설정버튼 */}
      <KebabButton
        onClick={(event: MouseEvent) => {
          event.stopPropagation();
          onClickKebab();
        }}
      />
      {/* 수정/삭제 모달 */}
      {isModalShown && (
        <ModalContainer>
          <TransparentBackground
            isOpened={isModalShown}
            onClick={(event) => {
              event.stopPropagation();
              onClickClose();
            }}
            blur={false}
          />
          <ButtonContainer>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onClickEdit(member);
                onClickClose();
              }}
            >
              <MainText>{t('button.edit')}</MainText>
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onClickDelete(member.familyMemberId);
                onClickClose();
              }}
            >
              <MainText color={DESTRUCTIVE.DEFAULT}>
                {t('button.delete')}
              </MainText>
            </Button>
          </ButtonContainer>
        </ModalContainer>
      )}
    </ItemContainer>
  );
};

export default FamilyMemberItem;
