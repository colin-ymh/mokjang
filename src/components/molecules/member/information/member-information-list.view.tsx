import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/member/member-column';
import { BLACK, GRAY, WHITE } from '@/constants/styles/color';
import {
  CALENDAR_MODE,
  GENDER,
  MARRIAGE,
  MEDIA_MAX_WIDTH,
} from '@/constants/constant';
import { LOCALE } from '@/constants/state/locale';
import { Member } from '@/models/member/member';
import { Ministry } from '@/models/management/management';
import { getLocaleDateFromDashDate } from '@/utils/format';
import { getThisYearBirth } from '@/utils/date';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import Pencil from '../../../../../public/svg/pencil.svg';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

const ListTypeHeader = styled.div`
  display: flex;
  min-height: 40px;
  background-color: ${GRAY.LIGHT};
  border-top: 1px solid ${GRAY.SEMI_LIGHT};
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
`;

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column; /* 모바일에서는 한 줄에 하나씩 표시 */
  }
`;

const PencilButton = styled(Pencil)`
  stroke: ${BLACK};
  fill: ${WHITE};
  stroke-width: 1px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  display: none; /* 기본적으로 숨김 */
`;

const InformationItem = styled.div<{ $disabled?: boolean }>`
  flex: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  padding: 15px 0;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  position: relative;
  width: 100%;

  @media (max-width: ${MEDIA_MAX_WIDTH.DESKTOP}) {
    &:hover {
      background-color: ${({ $disabled }) =>
        $disabled ? 'auto' : GRAY.SEMI_LIGHT};
    }

    &:hover ${PencilButton} {
      display: block;
    }
  }
`;

const BlankSpace = styled.div`
  flex: 1;
`;

const TitleContainer = styled.div`
  display: flex;
  padding-left: 20px;
  min-width: 100px;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    width: 100px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const MinistryContainer = styled.div`
  display: flex;
  border-radius: 5px;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${GRAY.DEFAULT};
  }
`;

const RowDivider = styled.div`
  display: none; /* 기본적으로 숨김 */

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    display: block; /* 모바일에서는 표시 */
    width: 100%;
    height: 1px;
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

const PaddingBottom = styled.div`
  height: 30px;
`;

const WrapText = styled(MainText)`
  white-space: pre-wrap; /* 여러 줄로 표시 & 공백/줄바꿈 문자도 해석 */
  word-break: break-word; /* 긴 단어를 영역 벗어나기 전에 줄바꿈 */
  overflow-wrap: break-word; /* 추가적인 안전 장치 */
`;

type InformationListViewProps = {
  prevMember: Member;
  onClickItem: (id: MEMBER) => void;
  onClickOpenBaptismModal: () => void;
  onClickOpenGroupModal: () => void;
  onClickOpenMinistryModal: (ministry?: Ministry) => void;
  onClickOpenOfficerModal: () => void;
};

const InformationListView = ({
  prevMember,
  onClickItem,
  onClickOpenBaptismModal,
  onClickOpenGroupModal,
  onClickOpenMinistryModal,
  onClickOpenOfficerModal,
}: InformationListViewProps) => {
  const t = useI18n();
  const t_header = useScopedI18n('header');
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('memberInformation')}</MainText>
      </ListTypeHeader>
      <InformationListContainer>
        <RowContainer>
          {/* 그룹 */}
          <InformationItem onClick={onClickOpenGroupModal}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.GROUP)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember?.group?.name}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <RowDivider />
          {/* 역할 */}
          <InformationItem onClick={onClickOpenGroupModal}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t('groupRole')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember?.groupRole?.role}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
        </RowContainer>
        <RowContainer>
          {/* 직분 */}
          <InformationItem onClick={onClickOpenOfficerModal}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.OFFICER)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember?.officer?.name}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <RowDivider />
          {/* 신급 */}
          <InformationItem onClick={onClickOpenBaptismModal}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t('baptism')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{t(prevMember.baptism)}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
        </RowContainer>
        <RowContainer>
          {/* 사역 */}
          <InformationItem
            onClick={(event) => {
              event.stopPropagation();
              onClickOpenMinistryModal();
            }}
          >
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t('ministry')}</MainText>
            </TitleContainer>
            <ContentContainer>
              {prevMember?.ministries?.map((item) => {
                return (
                  <MinistryContainer
                    key={item.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      onClickOpenMinistryModal(item);
                    }}
                  >
                    <MainText>{item.name}</MainText>
                  </MinistryContainer>
                );
              })}
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <BlankSpace />
        </RowContainer>
      </InformationListContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('personalInformation')}</MainText>
      </ListTypeHeader>
      <InformationListContainer>
        <RowContainer>
          {/* 이름 */}
          <InformationItem onClick={() => onClickItem(MEMBER.NAME)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.NAME)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember.name}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <RowDivider />
          {/* 성별 */}
          <InformationItem onClick={() => onClickItem(MEMBER.GENDER)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.GENDER)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{t(prevMember.gender as GENDER)}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
        </RowContainer>
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
                      : CALENDAR_MODE.SOLAR
                  )}
              </MainText>
              <MainText>
                {getLocaleDateFromDashDate(basePath, prevMember.birth)}
              </MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <RowDivider />
          {/* 생일 */}
          <InformationItem $disabled={true}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t('birthDay')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>
                {prevMember.birth &&
                  getLocaleDateFromDashDate(
                    basePath,
                    getThisYearBirth(prevMember.birth, prevMember.isLunar)
                  )}
              </MainText>
            </ContentContainer>
          </InformationItem>
        </RowContainer>
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
            <PencilButton />
          </InformationItem>
          <RowDivider />
          {/* 집전화번호 */}
          <InformationItem onClick={() => onClickItem(MEMBER.HOME_PHONE)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.HOME_PHONE)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember.homePhone}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
        </RowContainer>
        {/* 주소 라인 */}
        <RowContainer>
          {/* 도로명 주소 */}
          <InformationItem onClick={() => onClickItem(MEMBER.ADDRESS)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.ADDRESS)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <WrapText>{prevMember.address}</WrapText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <RowDivider />
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
            <PencilButton />
          </InformationItem>
        </RowContainer>
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
            <PencilButton />
          </InformationItem>
          <RowDivider />
          {/* 학교 */}
          <InformationItem onClick={() => onClickItem(MEMBER.SCHOOL)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.SCHOOL)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{prevMember.school}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
        </RowContainer>
        {/* 결혼 라인 */}
        <RowContainer>
          {/* 결혼 */}
          <InformationItem onClick={() => onClickItem(MEMBER.MARRIAGE)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>{t(MEMBER.MARRIAGE)}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{t(prevMember.marriage as MARRIAGE)}</MainText>
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <RowDivider />
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
            <PencilButton />
          </InformationItem>
        </RowContainer>
        <RowContainer>
          {/* 차량 번호 */}
          <InformationItem onClick={() => onClickItem(MEMBER.VEHICLE_NUMBER)}>
            <TitleContainer>
              <MainText color={GRAY.DEFAULT}>
                {t(MEMBER.VEHICLE_NUMBER)}
              </MainText>
            </TitleContainer>
            <ContentContainer>
              {prevMember?.vehicleNumber?.map((number, index) => (
                <MainText key={index}>{number}</MainText>
              ))}
            </ContentContainer>
            <PencilButton />
          </InformationItem>
          <BlankSpace />
        </RowContainer>
      </InformationListContainer>
      <PaddingBottom />
    </InformationContainer>
  );
};

export default InformationListView;
