import styled from 'styled-components';
import React from 'react';
import FakeDropdownButton from '@/components/atoms/common/button/fake-dropdown-button';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { BLANK } from '@/constants/constant';
import { Group } from '@/models/management/management';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import SelectGroupHierarchy from '@/components/organisms/group/select-group-hierarchy';
import WeekNavigator from '@/components/atoms/common/date/week-navigator';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { useAttendanceHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { ATTENDANCE_CONTENT_ID } from '@/constants/layout/content';
import { GRAY } from '@/constants/styles/color';
import AttendanceInformationTable from '@/components/molecules/attendance/information/attendance-information-table';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import WorshipSessionInformation from '@/components/molecules/attendance/information/worship-session-information';

const AttendanceInformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px 0;
  overflow-y: auto;
  gap: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 20px 20px 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const BarContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${GRAY.LIGHT};
  padding: 0 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  padding: 0 20px;
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

type AttendanceInformationProps = {
  contentId: ATTENDANCE_CONTENT_ID;
  isGroupModalShown: boolean;
  topLevelGroup: Group;
  onClickGroupItem: (id: string | null) => void;
  onClickWorshipItem: (id: string) => void;
  onClickOpenGroupModal: () => void;
  onClickCloseGroupModal: () => void;
  onChangeDate: (date: Date) => void;
  loadWorshipAttendances: () => Promise<void>;
  onClickHeaderBar: (id: ATTENDANCE_CONTENT_ID) => void;
};

const AttendanceInformation = ({
  contentId,
  isGroupModalShown,
  topLevelGroup,
  onClickGroupItem,
  onClickWorshipItem,
  onClickOpenGroupModal,
  onClickCloseGroupModal,
  onChangeDate,
  loadWorshipAttendances,
  onClickHeaderBar,
}: AttendanceInformationProps) => {
  const headerBarItems = useAttendanceHeaderBarItems();

  const t = useI18n();
  const t_title = useScopedI18n('title');
  const {
    targetWorshipSession,
    targetWorshipSessionGroup,
    targetWorshipSessionWorship,
  } = useSelector((state: RootState) => state.targetWorshipSession);
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const worshipDropdownItems = [
    {
      value: BLANK,
      title: t('none'),
    },
    ...worships.map((worship) => {
      return {
        value: worship.id,
        title: worship.title,
      };
    }),
  ];

  return (
    <AttendanceInformationContainer>
      {/* 제목 */}
      <TitleContainer>
        <MainText
          size={SIZE.EXTRA_LARGE}
        >{`${targetWorshipSessionWorship.title} ${t_title('attendanceInformation')} (${getDateStringFromDate(getDateFromDateString(targetWorshipSession.sessionDate))})`}</MainText>
      </TitleContainer>
      {/* 헤더 바 */}
      <BarContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </BarContainer>
      {/* 필터 행 */}
      <RowContainer>
        <LeftContainer>
          {/* 그룹 범위 설정*/}
          {contentId === ATTENDANCE_CONTENT_ID.ATTENDANCE && (
            <FakeDropdownButton
              title={targetWorshipSessionGroup.name || t('all')}
              isOpened={isGroupModalShown}
              onClick={onClickOpenGroupModal}
              width={120}
              height={40}
            />
          )}
        </LeftContainer>
        <RightContainer>
          {/* 예배 설정 */}
          <Dropdown
            value={targetWorshipSessionWorship.id}
            items={worshipDropdownItems}
            onChangeItem={onClickWorshipItem}
            width={120}
            height={40}
          />
          <WeekNavigator
            value={getDateFromDateString(targetWorshipSession.sessionDate)}
            dayOfWeek={targetWorshipSessionWorship.worshipDay}
            weekPeriod={targetWorshipSessionWorship.repeatPeriod}
            onChange={onChangeDate}
          />
        </RightContainer>
      </RowContainer>

      <ContentContainer>
        {contentId === ATTENDANCE_CONTENT_ID.ATTENDANCE && (
          // 출석부 목록
          <AttendanceInformationTable
            loadWorshipAttendances={loadWorshipAttendances}
          />
        )}
        {contentId === ATTENDANCE_CONTENT_ID.WORSHIP && (
          // 출석부 목록
          <WorshipSessionInformation />
        )}
      </ContentContainer>

      {/* 그룹 선택 모달 */}
      <CustomPopup
        isShow={isGroupModalShown}
        onClickCancel={onClickCloseGroupModal}
        width={400}
        height={600}
        isHeaderShown={false}
      >
        <GroupContainer>
          <SelectGroupHierarchy
            onChange={onClickGroupItem}
            topLevelGroupId={topLevelGroup.id}
          />
        </GroupContainer>
      </CustomPopup>
    </AttendanceInformationContainer>
  );
};

export default AttendanceInformation;
