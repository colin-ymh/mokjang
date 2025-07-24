import styled from 'styled-components';
import { GRAY } from '@/constants/styles/color';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { useI18n } from '../../../../locales/client';
import { WorshipEnrollment } from '@/models/worship/worship';
import { MainText } from '@/components/atoms/common/text/main-text';
import MainTag from '../common/tag/main-tag';
import {
  getAttendanceRateBackgroundColor,
  getAttendanceRateColor,
} from '@/utils/color';
import { getDateFromDateString, getDateStringFromDate } from '@/utils/date';
import { getTranslatedDateFromDateString } from '@/utils/translate';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  height: 350px;
`;

const WorshipAttendanceItem = styled.div`
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

type WorshipEnrollmentListProps = {
  worshipEnrollments: WorshipEnrollment[];
};

const WorshipEnrollmentList = ({
  worshipEnrollments,
}: WorshipEnrollmentListProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <ListContainer>
      {worshipEnrollments.map((item) => {
        return (
          <WorshipAttendanceItem key={item.member.id}>
            <RowContainer>
              <MainText>{item.member.name}</MainText>
              <MainTag
                title={`${Math.round(item.attendanceRate * 100).toString()}%`}
                backgroundColor={getAttendanceRateBackgroundColor(
                  Math.round(item.attendanceRate * 100)
                )}
                color={getAttendanceRateColor(
                  Math.round(item.attendanceRate * 100)
                )}
              />
            </RowContainer>
            <RowContainer>
              <MainTag title={item.member.group?.name || t('noGroup')} />
              <MainText
                color={GRAY.DEFAULT}
              >{`${t('lastPresent')}: ${getTranslatedDateFromDateString(locale, getDateStringFromDate(getDateFromDateString(item.lastPresentDate)))}`}</MainText>
            </RowContainer>
          </WorshipAttendanceItem>
        );
      })}
    </ListContainer>
  );
};

export default WorshipEnrollmentList;
