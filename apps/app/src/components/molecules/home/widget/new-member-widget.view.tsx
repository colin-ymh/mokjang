'use client';

import { CustomPopup, MainText } from '@mokjang/components';
import styled from 'styled-components';
import { GRAY, HOME_WIDGET, LOCALE, MAIN, SIZE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { usePathname } from 'next/navigation';
import {
  getDateFromDateString,
  getMonthDateFromDate,
  getTranslatedBeforeSomeWeek,
  getTranslatedMemberCount,
} from '@mokjang/utils';
import { Member, NewMemberSummary } from '@mokjang/models';
import NewMemberDetail from '../../../atoms/home/new-member-detail';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
`;

const WeekList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 5px;
`;

const WeekContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
`;

const WeekBar = styled.div`
  display: flex;
  width: 100%;
  border-radius: 5px;
  height: 7px;
  background-color: ${GRAY.LIGHT};
  position: relative;
`;

const CountBar = styled.div<{ $count: number; max: number }>`
  width: ${({ $count, max }) => (max ? ($count / max) * 100 : 0)}%;
  border-radius: 5px;
  height: 7px;
  background-color: ${MAIN.DEFAULT};
  position: absolute;
  left: 0;
  transition: width 0.2s ease-in-out;
`;

type NewMemberWidgetViewProps = {
  memberSummaries: NewMemberSummary[];
  memberDetails: Member[];
  detailTitle: string;
  isDetailShown: boolean;
  onClickWeek: (summary: NewMemberSummary) => void;
  onClickDetailClose: () => void;
};

const NewMemberWidgetView = ({
  memberSummaries,
  memberDetails,
  detailTitle,
  isDetailShown,
  onClickWeek,
  onClickDetailClose,
}: NewMemberWidgetViewProps) => {
  const t = useI18n();
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const maxCount = Math.max(...memberSummaries.map((s) => s.count), 0);
  const totalCount = memberSummaries.reduce((sum, s) => sum + s.count, 0);

  return (
    <>
      <WidgetContainer>
        {/* 타이틀 */}
        <WidgetHeader>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t_title(HOME_WIDGET.NEW_MEMBER)}
          </MainText>
        </WidgetHeader>

        {/* 통계 */}
        <BodyContainer>
          {/* 총합 */}
          <RowContainer>
            <MainText color={GRAY.SEMI_DARK}>
              {`${t('thisMonth')} ${t('newMember')}`}
            </MainText>
            <MainText color={MAIN.DEFAULT} fontSize={22} fontWeight={600}>
              {getTranslatedMemberCount(locale, totalCount)}
            </MainText>
          </RowContainer>
          {/* 주간 통계 */}
          <StateContainer>
            <MainText color={GRAY.DARK}>{t('weekNewMemberState')}</MainText>
            {/* 주 단위 상태바 */}
            <WeekList>
              {memberSummaries.map((summary, index) => (
                <WeekContainer
                  key={summary.periodStart}
                  onClick={() => onClickWeek(summary)}
                >
                  <RowContainer>
                    <MainText>
                      {`${getTranslatedBeforeSomeWeek(locale, index + 1)} (${getMonthDateFromDate(getDateFromDateString(summary.periodStart))})`}
                    </MainText>
                    <MainText color={GRAY.SEMI_DARK}>
                      {getTranslatedMemberCount(locale, summary.count)}
                    </MainText>
                  </RowContainer>
                  <WeekBar>
                    <CountBar $count={summary.count} max={maxCount} />
                  </WeekBar>
                </WeekContainer>
              ))}
            </WeekList>
          </StateContainer>
        </BodyContainer>
      </WidgetContainer>

      {/* 상세 팝업 */}
      <CustomPopup
        isShow={isDetailShown}
        onClickCancel={onClickDetailClose}
        width={400}
        height={500}
        headerTitle={detailTitle}
        isHeaderBorderShown={false}
        cancelText={t_button('close')}
      >
        <NewMemberDetail memberDetails={memberDetails} />
      </CustomPopup>
    </>
  );
};

export default NewMemberWidgetView;
