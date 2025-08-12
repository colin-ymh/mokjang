import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN } from '@/constants/styles/color';
import React, { Dispatch, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { TASK_STATUS } from '@/constants/status/status';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import {
  getTranslatedAddMemberTitle,
  getTranslatedDateFromDateString,
  getTranslatedSessionProgressStatus,
  getTranslatedTerm,
} from '@/utils/translate';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { useEducationTermHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { EDUCATION_TERM_CONTENT_ID } from '@/constants/layout/content';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import AddEnrollmentMemberModal from '@/components/atoms/education/education-enrollment/add-enrollment-member-modal';
import { Member } from '@/models/member/member';
import Button from '@/components/atoms/common/button/button';
import EducationEnrollmentTable from '@/components/molecules/education/education-enrollment/education-enrollment-table';

import User from '../../../../../../public/svg/user.svg';
import Users from '../../../../../../public/svg/users.svg';
import Pin from '../../../../../../public/svg/pin.svg';
import Calendar from '../../../../../../public/svg/calendar.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import { SIZE } from '@/constants/styles/style';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import ToggleRadioButton from '@/components/atoms/common/radio-button/toggle-radio-button';
import { RadioButtonValue } from '@/components/atoms/common/radio-button/radio-button-list';
import EducationSessionTable from '@/components/molecules/education/education-session/education-session-table';

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

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const TotalBar = styled.div`
  display: flex;
  width: 200px;
  border-radius: 5px;
  height: 7px;
  background-color: ${GRAY.LIGHT};
  position: relative;
`;

const CountBar = styled.div<{ $count: number; max: number }>`
  width: ${({ $count, max }) => (max ? ($count / max) * 100 : 0)}%;
  border-radius: 5px;
  height: 7px;
  background-color: ${MAIN.DEFAULT};
  position: absolute;
  left: 0;
`;

type EducationTermInformationViewProps = {
  isAddModalShown: boolean;
  headerBar: EDUCATION_TERM_CONTENT_ID;
  onChangeStatus: (status: TASK_STATUS) => void;
  onChangeHeaderBar: (headerBar: EDUCATION_TERM_CONTENT_ID) => void;
  onClickAddEnrollmentsOpen: () => void;
  onClickAddEnrollmentsClose: () => void;
  onClickSaveNewEnrollments: () => void;
  onClickAddEducationSessionOpen: () => void;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
};

const EducationTermInformationView = ({
  isAddModalShown,
  headerBar,
  onChangeStatus,
  onChangeHeaderBar,
  onClickAddEnrollmentsOpen,
  onClickAddEnrollmentsClose,
  onClickSaveNewEnrollments,
  onClickAddEducationSessionOpen,
  selectedMembers,
  setSelectedMembers,
}: EducationTermInformationViewProps) => {
  const t = useI18n();
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const statusDropdownItems = useTaskStatusDropdownItems();

  const headerBarItems: RadioButtonValue[] = useEducationTermHeaderBarItems();

  return (
    <>
      <InformationContainer>
        {/* 제목 */}
        <HeaderContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
            {`${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)}`}
          </MainText>
          <StatusDropdown
            value={targetEducationTerm.status}
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
            <MemberProfilePopupButton member={targetEducationTerm.inCharge} />
          </RowContainer>
          {/* 장소 */}
          <RowContainer>
            <TitleContainer>
              <SvgIcon svg={Pin} color={GRAY.DARK} />
              <MainText color={GRAY.DARK}>{t('location')}</MainText>
            </TitleContainer>
            <MainText>{targetEducationTerm.location}</MainText>
          </RowContainer>
          {/* 기간 */}
          <RowContainer>
            <TitleContainer>
              <SvgIcon svg={Calendar} color={GRAY.DARK} />
              <MainText color={GRAY.DARK}>{t('period')}</MainText>
            </TitleContainer>
            <MainText>
              {`${getTranslatedDateFromDateString(locale, targetEducationTerm.startDate)} - ${getTranslatedDateFromDateString(locale, targetEducationTerm.endDate)}`}
            </MainText>
          </RowContainer>
          {/* 상태 */}
          <RowContainer>
            <TitleContainer>
              <SvgIcon svg={User} color={GRAY.DARK} />
              <MainText color={GRAY.DARK}>{t('status')}</MainText>
            </TitleContainer>
            <StatusContainer>
              <MainText whiteSpace={'pre-wrap'} color={GRAY.SEMI_DARK}>
                {`${getTranslatedSessionProgressStatus(
                  locale,
                  targetEducationTerm.completedSessionsCount,
                  targetEducationTerm.sessionsCount
                )} (${
                  Math.round(
                    (targetEducationTerm.completedSessionsCount /
                      targetEducationTerm.sessionsCount) *
                      100
                  ) || 0
                }%)`}
              </MainText>
              <TotalBar>
                <CountBar
                  $count={targetEducationTerm.completedSessionsCount}
                  max={targetEducationTerm.sessionsCount}
                />
              </TotalBar>
            </StatusContainer>
          </RowContainer>
          {/* 보고대상자 */}
          <ColumnContainer>
            <TitleContainer>
              <SvgIcon svg={Users} color={GRAY.DARK} />
              <MainText color={GRAY.DARK}>{t('receiver')}</MainText>
            </TitleContainer>
            <MemberList>
              {targetEducationTerm.reports.map((report) => (
                <MemberProfilePopupButton
                  key={report.id}
                  member={report.receiver}
                />
              ))}
            </MemberList>
          </ColumnContainer>
          <RowLine />

          {/* 회차목록 / 수강교인 */}
          <TableHeader>
            <ToggleRadioButton
              selectedValue={headerBar}
              onChange={onChangeHeaderBar}
              items={headerBarItems}
            />
            {headerBar === EDUCATION_TERM_CONTENT_ID.ENROLLMENTS && (
              <Button
                text={t('button.addMember')}
                height={30}
                width={'auto'}
                onClick={onClickAddEnrollmentsOpen}
              />
            )}
            {headerBar === EDUCATION_TERM_CONTENT_ID.SESSIONS && (
              <Button
                text={t('button.addEducationSession')}
                height={30}
                width={'auto'}
                onClick={onClickAddEducationSessionOpen}
              />
            )}
          </TableHeader>
          <TableContainer>
            {headerBar === EDUCATION_TERM_CONTENT_ID.ENROLLMENTS && (
              <EducationEnrollmentTable />
            )}
            {headerBar === EDUCATION_TERM_CONTENT_ID.SESSIONS && (
              <EducationSessionTable />
            )}
          </TableContainer>
        </ContentContainer>
      </InformationContainer>

      {/* 교인 추가 팝업 */}
      <CustomPopup
        isShow={isAddModalShown}
        onClickCancel={onClickAddEnrollmentsClose}
        width={800}
        height={700}
        headerHeight={100}
        headerTitle={getTranslatedAddMemberTitle(
          locale,
          `${targetEducationTerm.educationName} - ${getTranslatedTerm(locale, targetEducationTerm.term)}`
        )}
        headerDescription={t('description.addMemberHeader')}
        doneText={t('button.add')}
        onClickDone={onClickSaveNewEnrollments}
      >
        <AddEnrollmentMemberModal
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />
      </CustomPopup>
    </>
  );
};

export default EducationTermInformationView;
