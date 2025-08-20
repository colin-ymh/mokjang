import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import React from 'react';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { TASK_STATUS } from '@/constants/status/status';
import { SIZE } from '@/constants/styles/style';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { getTranslatedDateFromDateString } from '@/utils/translate';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import User from '../../../../../public/svg/user.svg';
import Calendar from '../../../../../public/svg/calendar.svg';
import Users from '../../../../../public/svg/users.svg';
import Book from '../../../../../public/svg/book.svg';

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
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 30px;
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
  onChangeStatus: (status: TASK_STATUS) => void;
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
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {targetVisitation.title}
        </MainText>
        <StatusDropdown
          value={targetVisitation.status}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={30}
        />
      </HeaderContainer>
      <ContentContainer>
        {/* 담당자 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={User} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('inCharge')}</MainText>
          </TitleContainer>
          <MemberProfilePopupButton
            key={targetVisitation.inCharge.id}
            member={targetVisitation.inCharge}
          />
        </RowContainer>

        {/* 일정 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Calendar} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('schedule')}</MainText>
          </TitleContainer>
          {/* 일자 */}
          <PeriodContainer>
            <MainText>
              {targetVisitation.startDate &&
                getTranslatedDateFromDateString(
                  locale,
                  targetVisitation.startDate
                )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {targetVisitation.endDate &&
                getTranslatedDateFromDateString(
                  locale,
                  targetVisitation.endDate
                )}
            </MainText>
          </PeriodContainer>
        </RowContainer>

        {/* 심방대상자 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Users} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('visitedMember')}</MainText>
          </TitleContainer>
          <MemberList>
            {targetVisitation.members.map((member) => (
              <MemberProfilePopupButton key={member.id} member={member} />
            ))}
          </MemberList>
        </ColumnContainer>

        {/* 보고대상자 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Users} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('receiver')}</MainText>
          </TitleContainer>
          <MemberList>
            {targetVisitation?.reports?.map((report) => (
              <MemberProfilePopupButton
                key={report.id}
                member={report.receiver}
              />
            ))}
          </MemberList>
        </ColumnContainer>

        <RowLine />
        {/* 업무내용 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Book} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('visitationContent')}</MainText>
          </TitleContainer>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetVisitation.visitationDetails[0].visitationContent,
            }}
          />
        </ColumnContainer>
        <RowLine />
        {/* 기도제목 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Book} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('visitationPray')}</MainText>
          </TitleContainer>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetVisitation.visitationDetails[0].visitationPray,
            }}
          />
        </ColumnContainer>
      </ContentContainer>
    </InformationContainer>
  );
};

export default VisitationInformationView;
