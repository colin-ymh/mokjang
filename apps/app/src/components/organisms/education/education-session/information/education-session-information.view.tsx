import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { useI18n } from '../../../../../../locales/client';
import {
  Button,
  MainText,
  SvgIcon,
  ToggleRadioButton,
} from '@mokjang/components';
import { GRAY, GREEN, LOCALE, SIZE, TASK_STATUS } from '@mokjang/constants';
import React from 'react';
import { usePathname } from 'next/navigation';
import MemberProfilePopupButton from '../../../../molecules/common/button/member-profile-popup-button';
import { getTranslatedStartEndDate, getTranslatedTerm } from '@mokjang/utils';
import StatusDropdown from '../../../../atoms/common/dropdown/status-dropdown';
import { useTaskStatusDropdownItems } from '../../../../../hooks/dropdown/dropdown-items';
import EducationAttendanceTable from '../../../../molecules/education/education-attendance/education-attendance-table';
import { Svg } from '@mokjang/assets';
import { RadioButtonValue } from '../../../../atoms/common/radio-button/radio-button-list';
import { useEducationSessionHeaderBarItems } from '../../../../../hooks/layout/header-bar-items';
import { EDUCATION_SESSION_CONTENT_ID } from '../../../../../constants/layout/content';

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
  width: 100px;
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
            <SvgIcon svg={Svg.User} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('inCharge')}</MainText>
          </TitleContainer>
          <MemberProfilePopupButton member={targetEducationSession.inCharge} />
        </RowContainer>
        {/* 장소 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Pin} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('location')}</MainText>
          </TitleContainer>
          <MainText>{'본당'}</MainText>
        </RowContainer>
        {/* 기간 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Calendar} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('period')}</MainText>
          </TitleContainer>
          <MainText>
            {getTranslatedStartEndDate(
              locale,
              targetEducationSession.startDate,
              targetEducationSession.endDate
            )}
          </MainText>
        </RowContainer>
        {/* 보고대상자 */}
        <RowContainer>
          <TitleContainer>
            <SvgIcon svg={Svg.Users} color={GRAY.DARK} />
            <MainText color={GRAY.DARK}>{t('receiver')}</MainText>
          </TitleContainer>
          <MemberList>
            {targetEducationSession?.reports?.map((report) => (
              <MemberProfilePopupButton
                key={report.id}
                member={report.receiver}
              />
            ))}
          </MemberList>
        </RowContainer>

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
