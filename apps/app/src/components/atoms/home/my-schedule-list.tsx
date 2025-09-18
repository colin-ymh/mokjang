import { CALENDAR_DOMAIN, Schedule } from '@mokjang/models';
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
import {
  getStatusBackgroundColor,
  getStatusFontColor,
} from '../../../utils/color';
import EmptyList from '../common/image/empty-list';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

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
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
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

  const { user } = useSelector((state: RootState) => state.user);

  return (
    <ListContainer>
      {mySchedules.length > 0 ? (
        mySchedules.map((schedule) => {
          if (!schedule.id) {
            return;
          }

          const [domain, id] = schedule.id?.split('-');
          return (
            <ScheduleItem
              key={schedule.id}
              onClick={() => onClickSchedule(schedule)}
            >
              <ProfileImage
                value={user.churchUser[0]?.member.profileImageUrl}
                width={40}
                height={40}
              />
              <ColumnContainer>
                <RowContainer>
                  <MainText>
                    {schedule.title
                      ? `[${t(domain as CALENDAR_DOMAIN)}] ${schedule.title}`
                      : `[${t(domain as CALENDAR_DOMAIN)}] ${schedule.educationName} ${getTranslatedTerm(locale, schedule.educationTerm as string)}`}
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
                  {/*<MainTag title={} />*/}
                  <MainText color={GRAY.SEMI_DARK}>
                    {getTranslatedScheduleDate(
                      locale,
                      getDateFromDateString(schedule.end as string)
                    )}
                  </MainText>
                </RowContainer>
              </ColumnContainer>
            </ScheduleItem>
          );
        })
      ) : (
        <EmptyList />
      )}
    </ListContainer>
  );
};

export default MyScheduleList;
