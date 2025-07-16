'use client';

import { MainText } from '@/components/atoms/common/text/main-text';
import styled from 'styled-components';
import { SIZE } from '@/constants/styles/style';
import { GRAY, MAIN } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { HOME_WIDGET } from '@/constants/constant';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import {
  getTranslatedBeforeSomeWeek,
  getTranslatedMemberCount,
} from '@/utils/translate';
import { NewMemberSummary } from '@/models/home/widget';
import { getDateFromDateString, getMonthDateFromDate } from '@/utils/date';
import { Member } from '@/models/member/member';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import NewMemberDetail from '@/components/atoms/home/new-member-detail';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

const WidgetHeader = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  height: 300px;
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

const CountBar = styled.div<{ count: number; max: number }>`
  width: ${({ count, max }) => (max ? (count / max) * 100 : 0)}%;
  border-radius: 5px;
  height: 7px;
  background-color: ${MAIN.DEFAULT};
  position: absolute;
  left: 0;
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
                    <CountBar count={summary.count} max={maxCount} />
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
      >
        <NewMemberDetail memberDetails={memberDetails} />
      </CustomPopup>
    </>
  );
};

export default NewMemberWidgetView;
