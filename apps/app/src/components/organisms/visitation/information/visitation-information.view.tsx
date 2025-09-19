import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useTaskStatusDropdownItems } from '../../../../hooks/dropdown/dropdown-items';
import { useI18n } from '../../../../../locales/client';
import { MainText, SvgIcon } from '@mokjang/components';
import { GRAY, LOCALE, TASK_STATUS } from '@mokjang/constants';
import React from 'react';
import MemberProfilePopupButton from '../../../molecules/common/button/member-profile-popup-button';
import { usePathname } from 'next/navigation';
import { getTranslatedStartEndDate } from '@mokjang/utils';
import { Svg } from '@mokjang/assets';

const InformationContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 40px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  width: 100px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 30px;
  height: 30px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const MemberList = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
`;

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 0.6px;
  background-color: ${GRAY.LIGHT};
`;

type VisitationInformationViewProps = {
  onChangeStatus?: (status: TASK_STATUS) => void;
};

const VisitationInformationView = ({
  onChangeStatus,
}: VisitationInformationViewProps) => {
  const t = useI18n();
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const statusDropdownItems = useTaskStatusDropdownItems();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      {/* 제목 */}
      {/*<HeaderContainer>*/}
      {/*  <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>*/}
      {/*    {targetVisitation.title}*/}
      {/*  </MainText>*/}
      {/*  <StatusDropdown*/}
      {/*    value={targetVisitation.status}*/}
      {/*    items={statusDropdownItems}*/}
      {/*    onChangeItem={onChangeStatus}*/}
      {/*    width={100}*/}
      {/*    height={30}*/}
      {/*  />*/}
      {/*</HeaderContainer>*/}
      <ContentContainer>
        {/* 담당자 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.User} color={GRAY.EXTRA_DARK} />
            <MainText color={GRAY.EXTRA_DARK}>{t('inCharge')}</MainText>
          </TitleContainer>
          <MemberProfilePopupButton
            key={targetVisitation.inCharge.id}
            member={targetVisitation.inCharge}
          />
        </RowContainer>

        {/* 일정 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Calendar} color={GRAY.EXTRA_DARK} />
            <MainText color={GRAY.EXTRA_DARK}>{t('schedule')}</MainText>
          </TitleContainer>
          {/* 일자 */}
          <PeriodContainer>
            <MainText>
              {getTranslatedStartEndDate(
                locale,
                targetVisitation.startDate,
                targetVisitation.endDate
              )}
            </MainText>
          </PeriodContainer>
        </RowContainer>

        {/* 심방대상자 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Users} color={GRAY.EXTRA_DARK} />
            <MainText color={GRAY.EXTRA_DARK}>{t('visitedMember')}</MainText>
          </TitleContainer>
          <MemberList>
            {targetVisitation.members.map((member) => (
              <MemberProfilePopupButton key={member.id} member={member} />
            ))}
          </MemberList>
        </RowContainer>

        {/* 보고대상자 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Users} color={GRAY.EXTRA_DARK} />
            <MainText color={GRAY.EXTRA_DARK}>{t('receiver')}</MainText>
          </TitleContainer>
          <MemberList>
            {targetVisitation?.reports?.map((report) => (
              <MemberProfilePopupButton
                key={report.id}
                member={report.receiver}
              />
            ))}
          </MemberList>
        </RowContainer>

        <RowLine />
        {/* 업무내용 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Book} color={GRAY.EXTRA_DARK} size={16} />
            <MainText color={GRAY.EXTRA_DARK} fontSize={16}>
              {t('visitationContent')}
            </MainText>
          </TitleContainer>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetVisitation.visitationDetails[0].visitationContent,
            }}
            whiteSpace={'normal'}
          />
        </ColumnContainer>
        <RowLine />
        {/* 기도제목 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Book} color={GRAY.EXTRA_DARK} size={16} />
            <MainText color={GRAY.EXTRA_DARK} fontSize={16}>
              {t('visitationPray')}
            </MainText>
          </TitleContainer>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetVisitation.visitationDetails[0].visitationPray,
            }}
            whiteSpace={'normal'}
          />
        </ColumnContainer>
      </ContentContainer>
    </InformationContainer>
  );
};

export default VisitationInformationView;
