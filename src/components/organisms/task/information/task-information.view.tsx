import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';
import React from 'react';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { VISITATION_STATUS } from '@/constants/status/status';
import { SIZE } from '@/constants/styles/style';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import { getTranslatedDateFromDateString } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

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
  align-items: center;
  gap: 10px;
`;

type TaskInformationViewProps = {
  onChangeStatus: (status: VISITATION_STATUS) => void;
};

const TaskInformationView = ({ onChangeStatus }: TaskInformationViewProps) => {
  const t = useI18n();
  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const statusDropdownItems = useTaskStatusDropdownItems();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      <RowContainer>
        {/* 담당자 */}
        <CardContainer $minHeight={150}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('inCharge')}</MainText>
            <MemberProfilePopupButton
              key={targetTask.inCharge.id}
              member={targetTask.inCharge}
            />
          </ContentContainer>
        </CardContainer>

        {/* 일정 */}
        <CardContainer>
          <ContentContainer>
            <RowContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{t('schedule')}</MainText>
              <StatusDropdown
                value={targetTask.status}
                items={statusDropdownItems}
                onChangeItem={onChangeStatus}
                width={100}
                height={40}
              />
            </RowContainer>

            {/* 일자 */}
            <PeriodContainer>
              <MainText>
                {targetTask.startDate &&
                  getTranslatedDateFromDateString(locale, targetTask.startDate)}
              </MainText>
              <MainText>{'-'}</MainText>
              <MainText>
                {targetTask.endDate &&
                  getTranslatedDateFromDateString(locale, targetTask.endDate)}
              </MainText>
            </PeriodContainer>
          </ContentContainer>
        </CardContainer>
      </RowContainer>

      {/* 업무내용 */}
      <CardContainer $minHeight={200}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('content')}</MainText>
          <MainText
            dangerouslySetInnerHTML={{
              __html: targetTask.content,
            }}
          />
        </ContentContainer>
      </CardContainer>
      {/* 보고대상자 */}
      <CardContainer $minHeight={150}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('receiver')}</MainText>
          {targetTask.reports.map((report) => (
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

export default TaskInformationView;
