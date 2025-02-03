import styled from 'styled-components';

import { OfficerHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { GRAY } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';

import { useI18n } from '../../../../../locales/client';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

const BackgroundContainer = styled.div<{ $isCurrent?: boolean }>`
  display: flex;
  width: 100%;
  padding: 10px 0;
  border-bottom: ${({ $isCurrent }) => ($isCurrent ? '0px' : '1px')} solid
    ${GRAY.LIGHT};
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 50px;
  border-radius: 5px;
  position: relative;
  //cursor: pointer;
  transition: background-color 0.3s;
  // &:hover {
  //   background-color: ${GRAY.LIGHT};
  // }
`;

const NameContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const RoleContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const PeriodContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 2;
`;

const DateContainer = styled.div`
  display: flex;
  gap: 5px;
`;

type OfficerHistoryItemProps = {
  officer: OfficerHistory;
  onClickEditOfficer: (officer: OfficerHistory) => void;
  onClickDeleteOfficer: (officerId: string) => void;
  isCurrent?: boolean;
};

const OfficerHistoryItem = ({
  officer,
  onClickEditOfficer,
  onClickDeleteOfficer,
  isCurrent,
}: OfficerHistoryItemProps) => {
  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <BackgroundContainer $isCurrent={isCurrent}>
      <ItemContainer>
        {/* 직분명 */}
        <NameContainer>
          <MainText color={GRAY.DARK}>{t('officer')}</MainText>
          <MainText>{officer.officerSnapShot}</MainText>
        </NameContainer>
        {/* 직분 시작 교회 */}
        <RoleContainer>
          <MainText color={GRAY.DARK}>{t('officerStartChurch')}</MainText>
          <MainText>{officer.officerStartChurch}</MainText>
        </RoleContainer>
        {/* 기간 */}
        <PeriodContainer>
          <MainText color={GRAY.DARK}>{t('period')}</MainText>
          <DateContainer>
            <MainText>
              {getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(officer.startDate)
              )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {officer?.endDate
                ? getLocaleDateFromDashDate(
                    basePath,
                    getFormattedDate(officer?.endDate)
                  )
                : t('inProgress')}
            </MainText>
          </DateContainer>
        </PeriodContainer>
        {/* 버튼들 */}
        {!isCurrent && (
          <SlideButtonList
            isAddShown={false}
            buttonSize={25}
            onClickEdit={() => onClickEditOfficer(officer)}
            onClickDelete={() => onClickDeleteOfficer(officer.id)}
          />
        )}
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default OfficerHistoryItem;
