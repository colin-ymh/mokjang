import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useVisitationStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';
import React from 'react';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { VISITATION_STATUS } from '@/constants/status/status';
import { SIZE } from '@/constants/styles/style';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { getTranslatedDateFromDateString } from '@/utils/translate';

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
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight && $minHeight}px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const MemberTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: row;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

type VisitationInformationViewProps = {
  onChangeStatus: (status: VISITATION_STATUS) => void;
};

const VisitationInformationView = ({
  onChangeStatus,
}: VisitationInformationViewProps) => {
  const t = useI18n();
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const statusDropdownItems = useVisitationStatusDropdownItems();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      <CardContainer>
        <ContentContainer>
          <RowContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('schedule')}</MainText>
            <StatusDropdown
              value={targetVisitation.status}
              items={statusDropdownItems}
              onChangeItem={onChangeStatus}
              width={100}
              height={40}
            />
          </RowContainer>

          {/* 일자 */}
          <PeriodContainer>
            <MainText>
              {targetVisitation.startDate &&
                getTranslatedDateFromDateString(
                  locale,
                  targetVisitation.startDate
                )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {targetVisitation.endDate &&
                getTranslatedDateFromDateString(
                  locale,
                  targetVisitation.endDate
                )}
            </MainText>
          </PeriodContainer>
        </ContentContainer>
      </CardContainer>
      <RowContainer>
        {/* 대상자 */}
        <CardContainer $minHeight={150}>
          <ContentContainer>
            <MainText
              size={SIZE.EXTRA_LARGE}
            >{`${t('visitedMember')} (${targetVisitation.visitationDetails.length})`}</MainText>
            {targetVisitation.members.map((member) => (
              <MemberProfilePopupButton key={member.id} member={member} />
            ))}
          </ContentContainer>
        </CardContainer>
        {/* 담당자 */}
        <CardContainer $minHeight={150}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('inCharge')}</MainText>
            <MemberProfilePopupButton
              key={targetVisitation.inCharge.id}
              member={targetVisitation.inCharge}
            />
          </ContentContainer>
        </CardContainer>
      </RowContainer>
      {/* 심방내용 */}
      <CardContainer $minHeight={200}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('visitationContent')}</MainText>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetVisitation.visitationDetails[0].visitationContent,
            }}
          />
        </ContentContainer>
      </CardContainer>
      {/* 기도제목 */}
      <CardContainer $minHeight={150}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('visitationPray')}</MainText>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetVisitation.visitationDetails[0].visitationPray,
            }}
          />
        </ContentContainer>
      </CardContainer>
      {/* 보고대상자 */}
      <CardContainer $minHeight={150}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('receiver')}</MainText>
          {targetVisitation.reports.map((report) => (
            <MemberProfilePopupButton
              key={report.id}
              member={report.receiver}
            />
          ))}
        </ContentContainer>
      </CardContainer>
    </InformationContainer>
  );
};

export default VisitationInformationView;
