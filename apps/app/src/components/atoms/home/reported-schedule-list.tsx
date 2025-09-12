import { CALENDAR_DOMAIN, DOMAIN, Schedule } from '@mokjang/models';
import styled from 'styled-components';
import { GRAY, LOCALE, MAIN, STATUS } from '@mokjang/constants';
import { MainTag, MainText } from '@mokjang/components';
import {
  getDateFromDateString,
  getTranslatedScheduleDate,
} from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../../locales/client';
import {
  getStatusBackgroundColor,
  getStatusFontColor,
} from '../../../utils/color';
import { RefObject } from 'react';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  height: 350px;
`;

const ScheduleItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
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
      {mySchedules.map((schedule) => {
        if (!schedule.id) {
          return;
        }

        const [domain, id] = schedule.id?.split('-');

        return (
          <ScheduleItem
            key={schedule.id}
            onClick={() => onClickSchedule(schedule)}
          >
            <RowContainer>
              <MainText>{schedule.title}</MainText>
              <MainTag
                title={t(schedule.status as STATUS)}
                color={getStatusFontColor(schedule.status as STATUS)}
                backgroundColor={getStatusBackgroundColor(
                  schedule.status as STATUS
                )}
              />
            </RowContainer>
            <RowContainer>
              <MainTag title={t(domain as CALENDAR_DOMAIN)} />
              <MainText>
                {getTranslatedScheduleDate(
                  locale,
                  getDateFromDateString(schedule.end as string)
                )}
              </MainText>
              <MainText color={MAIN.DEFAULT}>
                {`${t('inCharge')}: ${schedule.inCharge?.name as string}`}
              </MainText>
            </RowContainer>
          </ScheduleItem>
        );
      })}
    </ListContainer>
  );
};

export default ReportedScheduleList;
