import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, GREEN } from '@/constants/styles/color';
import React from 'react';
import { SIZE } from '@/constants/styles/style';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { TASK_STATUS } from '@/constants/status/status';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import {
  getTranslatedDateFromDateString,
  getTranslatedTerm,
} from '@/utils/translate';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import Button from '@/components/atoms/common/button/button';
import EducationAttendanceTable from '@/components/molecules/education/education-attendance/education-attendance-table';
import User from '../../../../../../public/svg/user.svg';
import Users from '../../../../../../public/svg/users.svg';
import Pin from '../../../../../../public/svg/pin.svg';
import Calendar from '../../../../../../public/svg/calendar.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import ToggleRadioButton from '@/components/atoms/common/radio-button/toggle-radio-button';
import { RadioButtonValue } from '@/components/atoms/common/radio-button/radio-button-list';
import { useEducationSessionHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { EDUCATION_SESSION_CONTENT_ID } from '@/constants/layout/content';

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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 30px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 0 5px;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 0.6px;
  background-color: ${GRAY.LIGHT};
`;

const MemberList = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

type EducationSessionInformationViewProps = {
  headerBar: EDUCATION_SESSION_CONTENT_ID;
  onChangeHeaderBar: (headerBar: EDUCATION_SESSION_CONTENT_ID) => void;
  onChangeStatus: (status: TASK_STATUS) => void;
  onClickAllAttended: () => void;
};

const EducationSessionInformationView = ({
  headerBar,
  onChangeHeaderBar,
  onChangeStatus,
  onClickAllAttended,
}: EducationSessionInformationViewProps) => {
  const t = useI18n();
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const statusDropdownItems = useTaskStatusDropdownItems();

  const headerBarItems: RadioButtonValue[] =
    useEducationSessionHeaderBarItems();

  return (
    <InformationContainer>
      {/* 제목 */}
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)} - ${targetEducationSession.session}${t('session')} ${targetEducationSession.title}`}
        </MainText>
        <StatusDropdown
          value={targetEducationSession.status}
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
            <SvgIcon svg={User} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('inCharge')}</MainText>
          </TitleContainer>
          <MemberProfilePopupButton member={targetEducationSession.inCharge} />
        </RowContainer>
        {/* 장소 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Pin} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('location')}</MainText>
          </TitleContainer>
          <MainText>{'본당'}</MainText>
        </RowContainer>
        {/* 기간 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Calendar} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('period')}</MainText>
          </TitleContainer>
          <MainText>
            {`${getTranslatedDateFromDateString(locale, targetEducationSession.startDate)} - ${getTranslatedDateFromDateString(locale, targetEducationSession.endDate)}`}
          </MainText>
        </RowContainer>
        {/* 보고대상자 */}
        <ColumnContainer>
          <TitleContainer>
            <SvgIcon svg={Users} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('receiver')}</MainText>
          </TitleContainer>
          <MemberList>
            {targetEducationSession.reports.map((report) => (
              <MemberProfilePopupButton
                key={report.id}
                member={report.receiver}
              />
            ))}
          </MemberList>
        </ColumnContainer>

        <RowLine />
        {/* 수강교인 */}
        <TableHeader>
          <ToggleRadioButton
            selectedValue={headerBar}
            onChange={onChangeHeaderBar}
            items={headerBarItems}
          />
          {headerBar === EDUCATION_SESSION_CONTENT_ID.ATTENDANCE ? (
            <Button
              text={t('button.allAttended')}
              height={30}
              width={'auto'}
              backgroundColor={GREEN.DEFAULT}
              onClick={onClickAllAttended}
            />
          ) : (
            <div></div>
          )}
        </TableHeader>
        {headerBar === EDUCATION_SESSION_CONTENT_ID.CONTENT && (
          <ContentWrapper>
            <MainText
              dangerouslySetInnerHTML={{
                __html: targetEducationSession.content,
              }}
            />
          </ContentWrapper>
        )}
        {headerBar === EDUCATION_SESSION_CONTENT_ID.ATTENDANCE && (
          <TableContainer>
            <EducationAttendanceTable />
          </TableContainer>
        )}
      </ContentContainer>
    </InformationContainer>
  );
};

export default EducationSessionInformationView;
