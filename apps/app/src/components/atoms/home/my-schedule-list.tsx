import { Schedule } from '../../../models/calendar/calendar';
import styled from 'styled-components';
import { GRAY } from '../../../constants/styles/color';
import { MainText } from '../common/text/main-text';
import MainTag from '../common/tag/main-tag';
import { getDateFromDateString } from '../../../utils/date';
import {
  getTranslatedScheduleDate,
  getTranslatedTerm,
} from '../../../utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../constants/state/locale';
import { useI18n } from '../../../../locales/client';
import { DOMAIN } from '../../../models/permission/permission';
import {
  getStatusBackgroundColor,
  getStatusFontColor,
} from '../../../utils/color';
import { STATUS } from '../../../constants/status/status';

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

  const t = useI18n();

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
              <MainText>
                {schedule.title ||
                  `${schedule.educationName} ${getTranslatedTerm(locale, schedule.educationTerm as string)}`}
              </MainText>
              <MainTag
                title={t(schedule.status as STATUS)}
                color={getStatusFontColor(schedule.status as STATUS)}
                backgroundColor={getStatusBackgroundColor(
                  schedule.status as STATUS
                )}
              />
            </RowContainer>
            <RowContainer>
              <MainTag title={t(domain as DOMAIN)} />
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
