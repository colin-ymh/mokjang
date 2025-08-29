'use client';

import { MainText } from '../../../atoms/common/text/main-text';
import styled from 'styled-components';
import { SIZE } from '../../../../constants/styles/style';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { HOME_WIDGET, RANGE } from '../../../../constants/constant';
import React from 'react';
import ToggleRadioButton from '../../../atoms/common/radio-button/toggle-radio-button';
import { useMonthQuarterHalfRangeRadioButtonItems } from '../../../../hooks/radio-button/radio-button-items';
import { WorshipEnrollment } from '../../../../models/worship/worship';
import WorshipEnrollmentList from '../../../atoms/home/worship-enrollment-list';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { DropdownValueType } from '../../../atoms/common/dropdown/dropdown-item';
import Dropdown from '../../../atoms/common/dropdown/dropdown';
import { getTranslateWorshipAttendanceWidgetDescription } from '../../../../utils/translate';
import { getTranslatedMemberCount } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../constants/state/locale';
import { MAIN } from '../../../../constants/styles/color';
import Warning from '../../../../../public/svg/warning.svg';

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

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const InformationContainer = styled.div`
  display: flex;
  border-radius: 10px;
  gap: 10px;
  padding: 10px;
  background-color: ${MAIN.EXTRA_LIGHT};
  flex-direction: column;
`;

const WarningIcon = styled(Warning)`
  width: 20px;
  height: 20px;
  stroke: ${MAIN.DEFAULT};
  stroke-width: 2px;
`;

type WorshipAttendanceWidgetViewProps = {
  range: RANGE;
  worshipId: string;
  worshipEnrollments: WorshipEnrollment[];
  onChangeWorship: (id: string) => void;
  onClickRange: (range: RANGE) => void;
  onScrollBottom: () => void;
};

const WorshipAttendanceWidgetView = ({
  range,
  worshipId,
  worshipEnrollments,
  onChangeWorship,
  onClickRange,
  onScrollBottom,
}: WorshipAttendanceWidgetViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_title = useScopedI18n('title');

  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const rangeRadioItems = useMonthQuarterHalfRangeRadioButtonItems();

  const worshipDropdownItems: DropdownValueType[] = worships.map((worship) => ({
    value: worship.id,
    title: worship.title,
  }));

  return (
    <>
      <WidgetContainer>
        {/* 타이틀 */}
        <WidgetHeader>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t_title(HOME_WIDGET.WORSHIP_ATTENDANCE)}
          </MainText>
        </WidgetHeader>

        <RowContainer>
          {/* 범위 설정 */}
          <ToggleRadioButton
            selectedValue={range}
            onChange={onClickRange}
            items={rangeRadioItems}
          />
          {/* 예배 선택 */}
          <Dropdown
            value={worshipId}
            items={worshipDropdownItems}
            onChangeItem={onChangeWorship}
            height={35}
            onScrollBottom={onScrollBottom}
          />
        </RowContainer>

        {/* 카운트 */}
        <InformationContainer>
          <RowContainer>
            <WarningIcon />
            <MainText color={MAIN.DEFAULT}>
              {getTranslateWorshipAttendanceWidgetDescription(locale, t(range))}
            </MainText>
          </RowContainer>
          <MainText fontSize={22} fontWeight={600} color={MAIN.DARK}>
            {getTranslatedMemberCount(locale, worshipEnrollments.length)}
          </MainText>
        </InformationContainer>

        {/* 교인 목록 */}
        <WorshipEnrollmentList worshipEnrollments={worshipEnrollments} />
      </WidgetContainer>
    </>
  );
};

export default WorshipAttendanceWidgetView;
