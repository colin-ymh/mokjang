import { DOMAIN, NOTIFICATION_DOMAIN, Schedule } from '@mokjang/models';
import styled from 'styled-components';
import { GRAY, LOCALE, STATUS } from '@mokjang/constants';
import { MainTag, MainText, ProfileImage } from '@mokjang/components';
import {
  getDateFromDateString,
  getTranslatedScheduleDate,
  getTranslatedTerm,
} from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../../locales/client';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import { RefObject } from 'react';
import EmptyList from '@/components/atoms/common/image/empty-list';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  height: 350px;
`;

const ScheduleItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const StatusContainer = styled.div`
  display: flex;
  position: absolute;
  right: 10px;
  top: 10px;
`;

type ReportedScheduleListProps = {
  scrollRef: RefObject<HTMLDivElement>;
  mySchedules: Schedule[];
  onClickSchedule: (schedule: Schedule) => void;
};

const ReportedScheduleList = ({
  scrollRef,
  mySchedules,
  onClickSchedule,
}: ReportedScheduleListProps) => {
  const t = useI18n();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <ListContainer ref={scrollRef}>
      {mySchedules.length > 0 ? (
        mySchedules.map((schedule) => {
          if (!schedule.id) {
            return;
          }

          const [domain, id] = schedule.id?.split('-');

          let scheduleTitle = schedule.title;

          if (domain === NOTIFICATION_DOMAIN.EDUCATION_TERM) {
            scheduleTitle = `${schedule.educationName} ${schedule.educationTerm && getTranslatedTerm(LOCALE.KO, schedule.educationTerm)}`;
          }

          if (domain === NOTIFICATION_DOMAIN.EDUCATION_SESSION) {
            scheduleTitle = `${schedule.educationName} ${schedule.educationTerm && getTranslatedTerm(LOCALE.KO, schedule.educationTerm)} ${schedule.title}`;
          }

          return (
            <ScheduleItem
              key={schedule.id}
              onClick={() => onClickSchedule(schedule)}
            >
              <ProfileImage
                value={schedule.inCharge?.profileImageUrl}
                width={40}
                height={40}
              />
              <ColumnContainer>
                <MainText
                  whiteSpace={'nowrap'}
                >{`[${t(domain as DOMAIN)}] ${scheduleTitle}`}</MainText>

                <MainText color={GRAY.SEMI_DARK}>
                  {getTranslatedScheduleDate(
                    locale,
                    getDateFromDateString(schedule.end as string)
                  )}
                </MainText>
              </ColumnContainer>

              <StatusContainer>
                <MainTag
                  title={t(schedule.status as STATUS)}
                  color={getStatusFontColor(schedule.status as STATUS)}
                  backgroundColor={getStatusBackgroundColor(
                    schedule.status as STATUS
                  )}
                />
              </StatusContainer>
            </ScheduleItem>
          );
        })
      ) : (
        <EmptyList />
      )}
    </ListContainer>
  );
};

export default ReportedScheduleList;
