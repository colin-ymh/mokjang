import { Schedule } from '@/models/calendar/calendar';
import styled from 'styled-components';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import StatusTag from '@/components/atoms/common/tag/status-tag';
import { STATUS } from '@/constants/status/status';
import DomainTag from '@/components/atoms/common/tag/domain-tag';
import { DOMAIN } from '@/models/permission/permission';
import { getDateFromDateString } from '@/utils/date';
import { getTranslatedScheduleDate } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
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

type MyScheduleListProps = {
  mySchedules: Schedule[];
  onClickSchedule: (schedule: Schedule) => void;
};

const MyScheduleList = ({
  mySchedules,
  onClickSchedule,
}: MyScheduleListProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <ListContainer>
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
              <StatusTag status={schedule.status as STATUS} />
            </RowContainer>
            <RowContainer>
              <DomainTag domain={domain as DOMAIN} />
              <MainText>
                {getTranslatedScheduleDate(
                  locale,
                  getDateFromDateString(schedule.end as string)
                )}
              </MainText>
            </RowContainer>
          </ScheduleItem>
        );
      })}
    </ListContainer>
  );
};

export default MyScheduleList;
