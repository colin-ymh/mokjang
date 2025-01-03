import Image from "next/image";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { FAMILY, GENDER } from "@/constants/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import { FamilyMember, Member } from "@/models/member/member";
import { BLACK, GRAY, WHITE } from "@/constants/styles/color";
import { MEMBER } from "@/constants/member/member-column";
import FamilyModal from "@/components/molecules/member/information/family-modal";
import { getFormattedMobilePhone } from "@/utils/format";
import { getAge } from "@/utils/date";

import { useI18n, useScopedI18n } from "../../../../../locales/client";
import DefaultImage from "../../../../../public/png/default-member-image.png";
import Kebab from "../../../../../public/svg/kebab.svg";
import Plus from "../../../../../public/svg/plus.svg";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  border-top: 1px solid ${GRAY.LIGHT};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  background-color: ${GRAY.DEFAULT};
  border-radius: 5px;
  cursor: pointer;
`;

const PlusButton = styled(Plus)`
  stroke: ${WHITE};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
`;

const FamilyItemListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;
`;

const FamilyMemberItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
  border-radius: 5px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const ProfileImage = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-left: 5px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${GRAY.LIGHT};
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

const FamilyModalContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? "flex" : "none")};
  position: absolute;

  z-index: 200;
  background-color: ${WHITE};
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  right: 10px;
  top: 40px;
`;

type FamilyInformationListViewProps = {
  isModalShown: boolean;
  targetFamilyMember: Member;
  onClickOpenModal: () => void;
  onClickSaveFamily: (
    isEdit: boolean,
    familyMemberId: string,
    relation: FAMILY,
  ) => void;
  onClickCloseModal: () => void;
};

const FamilyInformationListView = ({
  isModalShown,
  targetFamilyMember,
  onClickOpenModal,
  onClickSaveFamily,
  onClickCloseModal,
}: FamilyInformationListViewProps) => {
  const t = useI18n();
  const t_header = useScopedI18n("header");
  const targetMember = useSelector(
    (state: RootState) => state.targetMember.targetMember,
  );

  return (
    <ListContainer>
      {/* 가족정보 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header("familyInformation")}</MainText>
        {/* 가족 추가 버튼*/}
        <ButtonContainer onClick={onClickOpenModal}>
          <PlusButton />
        </ButtonContainer>
      </ListTypeHeader>
      {/* 가족 목록 */}
      <FamilyItemListContainer>
        {targetMember.family.map((member: FamilyMember) => {
          return (
            <div key={member.familyMemberId}>
              <FamilyMemberItem>
                {/* 관계 */}
                <MemberInformationContainer>
                  <MainText fontWeight={600}>{t(member.relation)}</MainText>
                </MemberInformationContainer>
                {/* 이미지 */}
                <ProfileImage src={DefaultImage} alt={"profileImage"} />
                {/* 이름 */}
                <MemberInformationContainer>
                  <MainText color={GRAY.DEFAULT}>{t(MEMBER.NAME)}</MainText>
                  <MainText>{member.familyMember.name}</MainText>
                </MemberInformationContainer>
                {/* 나이 */}
                <MemberInformationContainer>
                  <MainText color={GRAY.DEFAULT}>{t(MEMBER.AGE)}</MainText>
                  {member?.familyMember?.birth && (
                    <MainText>
                      {getAge(new Date(member.familyMember.birth))}
                    </MainText>
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
                  <MainText>{member.familyMember?.group?.name}</MainText>
                </MemberInformationContainer>
                {/* 전화번호 */}
                <MemberInformationContainer>
                  <MainText color={GRAY.DEFAULT}>
                    {t(MEMBER.MOBILE_PHONE)}
                  </MainText>
                  <MainText>
                    {getFormattedMobilePhone(member.familyMember.mobilePhone)}
                  </MainText>
                </MemberInformationContainer>
                {/* 우측 설정버튼 */}
                <KebabButton />
              </FamilyMemberItem>
              <Divider />
            </div>
          );
        })}
      </FamilyItemListContainer>
      {/* 교인 가족 추가 및 수정 모달*/}
      <FamilyModalContainer $isShown={isModalShown}>
        <FamilyModal
          member={targetMember}
          familyMember={targetFamilyMember}
          onClickClose={onClickCloseModal}
          onClickSave={onClickSaveFamily}
        />
      </FamilyModalContainer>
    </ListContainer>
  );
};

export default FamilyInformationListView;
