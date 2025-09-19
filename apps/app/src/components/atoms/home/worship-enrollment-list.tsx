import styled from 'styled-components';
import { GRAY, LOCALE } from '@mokjang/constants';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../../locales/client';
import { WorshipEnrollment } from '@mokjang/models';
import { MainTag, MainText, ProfileImage } from '@mokjang/components';
import {
  getWorshipAttendanceRateBackgroundColor,
  getWorshipAttendanceRateColor,
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
  flex-direction: row;
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
              <ProfileImage
                value={item.member.profileImageUrl}
                width={40}
                height={40}
              />
              <ColumnContainer>
                <RowContainer>
                  <MainText>{item.member.name}</MainText>
                  <MainTag
                    title={`${Math.round(item.attendanceRate * 100).toString()}%`}
                    backgroundColor={getWorshipAttendanceRateBackgroundColor(
                      Math.round(item.attendanceRate * 100)
                    )}
                    color={getWorshipAttendanceRateColor(
                      Math.round(item.attendanceRate * 100)
                    )}
                  />
                </RowContainer>
                <RowContainer>
                  <MainText color={GRAY.SEMI_DARK}>
                    {item.member.group?.name || t('noGroup')}
                  </MainText>
                  <MainText
                    color={GRAY.DEFAULT}
                  >{`${t('lastPresent')}: ${getTranslatedDateFromDateString(locale, getDateStringFromDate(getDateFromDateString(item.lastPresentDate)))}`}</MainText>
                </RowContainer>
              </ColumnContainer>
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
