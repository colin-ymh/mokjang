import styled from 'styled-components';
import { GRAY, LOCALE } from '@mokjang/constants';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../../locales/client';
import { WorshipEnrollment } from '@mokjang/models';
import { MainTag, MainText } from '@mokjang/components';
import {
  getEducationAttendanceRateBackgroundColor,
  getEducationAttendanceRateColor,
} from '@/utils/color';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getTranslatedDateFromDateString,
} from '@mokjang/utils';
import EmptyList from '@/components/atoms/common/image/empty-list';

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
      {worshipEnrollments.length > 0 ? (
        worshipEnrollments.map((item) => {
          return (
            <WorshipAttendanceItem key={item.member.id}>
              <RowContainer>
                <MainText>{item.member.name}</MainText>
                <MainTag
                  title={`${Math.round(item.attendanceRate * 100).toString()}%`}
                  backgroundColor={getEducationAttendanceRateBackgroundColor(
                    Math.round(item.attendanceRate * 100)
                  )}
                  color={getEducationAttendanceRateColor(
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
        })
      ) : (
        <EmptyList />
      )}
    </ListContainer>
  );
};

export default WorshipEnrollmentList;
