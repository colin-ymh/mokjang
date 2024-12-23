import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MainText } from "@/components/atoms/common/text/main-text";
import { MEMBER } from "@/constants/member/member-column";
import { GRAY } from "@/constants/styles/color";

import { useI18n } from "../../../../locales/client";
import { Member } from "@/models/member/member";

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const InformationItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  width: 150px;
`;

const ContentContainer = styled.div`
  display: flex;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${GRAY.LIGHT};
  margin: 10px 0;
`;

type PersonalInformationListViewProps = {
  prevMember: Member;
  onClickItem: (id: MEMBER) => void;
};

const PersonalInformationListView = ({
  prevMember,
  onClickItem,
}: PersonalInformationListViewProps) => {
  const t = useI18n();

  return (
    <InformationListContainer>
      {/* 이름 */}
      <InformationItem onClick={() => onClickItem(MEMBER.NAME)}>
        <TitleContainer>
          <MainText color={GRAY.DEFAULT}>{t(MEMBER.NAME)}</MainText>
        </TitleContainer>
        <ContentContainer>
          <MainText>{prevMember.name}</MainText>
        </ContentContainer>
      </InformationItem>
      <Divider />
      {/* 성별 */}
      <InformationItem onClick={() => onClickItem(MEMBER.GENDER)}>
        <TitleContainer>
          <MainText color={GRAY.DEFAULT}>{t(MEMBER.GENDER)}</MainText>
        </TitleContainer>
        <ContentContainer>
          <MainText>{prevMember.gender}</MainText>
        </ContentContainer>
      </InformationItem>
      <Divider />
      {/* 생년월일 라인 */}
      <RowContainer>
        {/* 생년월일 */}
        <InformationItem onClick={() => onClickItem(MEMBER.BIRTH)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.BIRTH)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.birth}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 양력음력 */}
        <InformationItem onClick={() => onClickItem(MEMBER.IS_LUNAR)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{"양력/음력"}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.isLunar}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <Divider />
      {/* 번호 라인 */}
      <RowContainer>
        {/* 휴대전화번호 */}
        <InformationItem onClick={() => onClickItem(MEMBER.MOBILE_PHONE)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.MOBILE_PHONE)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.mobilePhone}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 집전화번호 */}
        <InformationItem onClick={() => onClickItem(MEMBER.HOME_PHONE)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.HOME_PHONE)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.homePhone}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <Divider />
      {/* 주소 라인 */}
      <RowContainer>
        {/* 도로명 주소 */}
        <InformationItem onClick={() => onClickItem(MEMBER.ADDRESS)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.ADDRESS)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.address}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 상세 주소 */}
        <InformationItem onClick={() => onClickItem(MEMBER.DETAIL_ADDRESS)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.DETAIL_ADDRESS)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.detailAddress}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <Divider />
      {/* 직업 라인 */}
      <RowContainer>
        {/* 직업 */}
        <InformationItem onClick={() => onClickItem(MEMBER.OCCUPATION)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.OCCUPATION)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.occupation}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 학교 */}
        <InformationItem onClick={() => onClickItem(MEMBER.SCHOOL)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.SCHOOL)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.school}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <Divider />
      {/* 결혼 라인 */}
      <RowContainer onClick={() => onClickItem(MEMBER.MARRIAGE)}>
        {/* 결혼 */}
        <InformationItem>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>{t(MEMBER.MARRIAGE)}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.marriage}</MainText>
          </ContentContainer>
        </InformationItem>
        {/* 결혼 상세 */}
        <InformationItem onClick={() => onClickItem(MEMBER.DETAIL_MARRIAGE)}>
          <TitleContainer>
            <MainText color={GRAY.DEFAULT}>
              {t(MEMBER.DETAIL_MARRIAGE)}
            </MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>{prevMember.detailMarriage}</MainText>
          </ContentContainer>
        </InformationItem>
      </RowContainer>
      <Divider />
      {/* 차량 번호 */}
      <InformationItem onClick={() => onClickItem(MEMBER.VEHICLE_NUMBER)}>
        <TitleContainer>
          <MainText color={GRAY.DEFAULT}>{t(MEMBER.VEHICLE_NUMBER)}</MainText>
        </TitleContainer>
        <ContentContainer>
          <MainText>{prevMember.vehicleNumber}</MainText>
        </ContentContainer>
      </InformationItem>
      <Divider />
    </InformationListContainer>
  );
};

export default PersonalInformationListView;
