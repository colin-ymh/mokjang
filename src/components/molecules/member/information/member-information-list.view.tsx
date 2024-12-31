import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import { MEMBER } from "@/constants/member/member-column";
import { GRAY } from "@/constants/styles/color";
import { CALENDAR_MODE, GENDER, MARRIAGE } from "@/constants/constant";
import { Member } from "@/models/member/member";
import { getKRDateFromDashDate } from "@/utils/format";
import { getThisYearBirth } from "@/utils/date";

import { useI18n, useScopedI18n } from "../../../../../locales/client";

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  border-top: 1px solid ${GRAY.LIGHT};
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
`;

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const InformationItem = styled.div`
  flex: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

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
  gap: 10px;
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
  const t_header = useScopedI18n("header");

  return (
    <InformationContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header("memberInformation")}</MainText>
      </ListTypeHeader>
      <InformationListContainer>
        <RowContainer>
          {/* 사역 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.MINISTRY)}</MainText>
            </TitleContainer>
            <ContentContainer>
              {prevMember?.ministries?.map((item) => {
                return <MainText key={item.id}>{item.name}</MainText>;
              })}
            </ContentContainer>
          </InformationItem>
          {/* 신급 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.BAPTISM)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{t(prevMember.baptism)}</MainText>
            </ContentContainer>
          </InformationItem>
        </RowContainer>
        <Divider />
        <RowContainer>
          {/* 직분 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.OFFICER)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember?.officer?.name}</MainText>
            </ContentContainer>
          </InformationItem>
          {/* 임직일 */}
          <InformationItem>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>
                {t(MEMBER.OFFICER_START_DATE)}
              </MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>
                {prevMember.officerStartDate &&
                  getKRDateFromDashDate(prevMember.officerStartDate)}
              </MainText>
            </ContentContainer>
          </InformationItem>
        </RowContainer>
      </InformationListContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header("personalInformation")}</MainText>
      </ListTypeHeader>
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
            <MainText>{t(prevMember.gender as GENDER)}</MainText>
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
              <MainText>
                {prevMember.birth &&
                  t(
                    prevMember.isLunar
                      ? CALENDAR_MODE.LUNAR
                      : CALENDAR_MODE.SOLAR,
                  )}
              </MainText>
              <MainText>{getKRDateFromDashDate(prevMember.birth)}</MainText>
            </ContentContainer>
          </InformationItem>
          {/* 생일 */}
          <InformationItem onClick={() => onClickItem(MEMBER.IS_LUNAR)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t("birthDay")}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>
                {prevMember.birth &&
                  getKRDateFromDashDate(
                    getThisYearBirth(prevMember.birth, prevMember.isLunar),
                  )}
              </MainText>
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
              <MainText color={GRAY.DEFAULT}>
                {t(MEMBER.DETAIL_ADDRESS)}
              </MainText>
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
              <MainText>{t(prevMember.marriage as MARRIAGE)}</MainText>
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
            {prevMember.vehicleNumber.map((number) => (
              <MainText key={number}>{number}</MainText>
            ))}
          </ContentContainer>
        </InformationItem>
        <Divider />
      </InformationListContainer>
    </InformationContainer>
  );
};

export default PersonalInformationListView;
