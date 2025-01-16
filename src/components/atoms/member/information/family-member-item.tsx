import styled from 'styled-components';
import Image from 'next/image';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';
import { MEMBER } from '@/constants/member/member-column';
import { getAge } from '@/utils/date';
import { GENDER } from '@/constants/constant';
import { getFormattedMobilePhone } from '@/utils/format';
import { FamilyMember } from '@/models/member/member';
import { getCurrentGroup } from '@/utils/history';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';

import DefaultImage from '../../../../../public/png/default-member-image.png';
import { useI18n } from '../../../../../locales/client';

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
`;

const InformationList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  overflow-x: auto;
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 20%;
  margin-left: 5px;
`;

const MemberInformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  gap: 20px;
  min-width: 50px;
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

  return (
    <ItemContainer onClick={() => onClickFamilyMember(member.familyMemberId)}>
      <InformationList>
        {/* 관계 */}
        <MemberInformationContainer>
          <MainText fontWeight={600}>{t(member.relation)}</MainText>
        </MemberInformationContainer>
        {/* 이미지 */}
        <ProfileImage src={DefaultImage} alt={'profileImage'} />
        {/* 이름 */}
        <MemberInformationContainer>
          <MainText color={GRAY.DEFAULT}>{t(MEMBER.NAME)}</MainText>
          <MainText>{member.familyMember?.name}</MainText>
        </MemberInformationContainer>
        {/* 나이 */}
        <MemberInformationContainer>
          <MainText color={GRAY.DEFAULT}>{t(MEMBER.AGE)}</MainText>
          {member?.familyMember?.birth && (
            <MainText>{getAge(new Date(member.familyMember.birth))}</MainText>
          )}
        </MemberInformationContainer>
        {/* 성별 */}
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
      </InformationList>
      {/* 수정/삭제 모달 */}
      <SlideButtonList
        onClickEdit={(event) => {
          event.stopPropagation();
          onClickEdit(member);
        }}
        onClickDelete={(event) => {
          event.stopPropagation();
          onClickDelete(member.familyMemberId);
        }}
        isAddShown={false}
        buttonSize={25}
        hoverBackgroundColor={WHITE}
      />
    </ItemContainer>
  );
};

export default FamilyMemberItem;
