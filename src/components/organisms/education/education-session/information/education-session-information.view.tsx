import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';
import React from 'react';
import { SIZE } from '@/constants/styles/style';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { EDUCATION_SESSION_STATUS } from '@/constants/status/status';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import { getTranslatedDateFromDateString } from '@/utils/translate';
import Button from '@/components/atoms/common/button/button';
import EducationAttendanceTable from '@/components/molecules/education/education-attendance/education-attendance-table';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CardContainer = styled.div<{ $minHeight?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  min-height: ${({ $minHeight }) => $minHeight && $minHeight}px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type EducationSessionInformationViewProps = {
  onChangeStatus: (status: EDUCATION_SESSION_STATUS) => void;
};

const EducationSessionInformationView = ({
  onChangeStatus,
}: EducationSessionInformationViewProps) => {
  const t = useI18n();
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      <RowContainer>
        {/* 담당자 */}
        <CardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('inCharge')}</MainText>
            <MemberProfilePopupButton
              member={targetEducationSession.inCharge}
            />
          </ContentContainer>
        </CardContainer>
        {/* 장소 */}
        <CardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('location')}</MainText>
            <MainText>{'본당'}</MainText>
          </ContentContainer>
        </CardContainer>
        {/* 기간 */}
        <CardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('period')}</MainText>
            <MainText>
              {`${getTranslatedDateFromDateString(locale, targetEducationSession.startDate)} - ${getTranslatedDateFromDateString(locale, targetEducationSession.endDate)}`}
            </MainText>
          </ContentContainer>
        </CardContainer>
        {/* 상태 */}
        <CardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('status')}</MainText>
          </ContentContainer>
        </CardContainer>
      </RowContainer>
      {/* 수업 내용 */}
      <CardContainer $minHeight={200}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('content')}</MainText>
        </ContentContainer>
      </CardContainer>
      {/* 수강교인 */}
      <CardContainer $minHeight={200}>
        <ContentContainer>
          <RowContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t('educationEnrollment')}
            </MainText>
            <Button
              text={t('button.addMember')}
              height={30}
              width={'auto'}
              // onClick={onClickAddEnrollmentsOpen}
            />
          </RowContainer>
          <TableContainer>
            <EducationAttendanceTable />
          </TableContainer>
        </ContentContainer>
      </CardContainer>
    </InformationContainer>
  );
};

export default EducationSessionInformationView;
