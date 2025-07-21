import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../locales/client';
import CheckButtonList, {
  CheckButtonValue,
} from '@/components/atoms/common/button/check-button-list';
import {
  useBaptismDropdownItems,
  useMarriageDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import { MainText } from '@/components/atoms/common/text/main-text';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
} from '@/utils/date';
import { GRAY, MAIN } from '@/constants/styles/color';
import CustomSlider from '@/components/atoms/common/slider/custom-slider';
import { getTranslatedAge } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

const TableSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RangeContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const AgeRangeTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${MAIN.LIGHT};
  background-color: ${MAIN.EXTRA_LIGHT};
  border-radius: 1000px;
  padding: 5px 13px;
`;

type TableSettingViewProps = {
  ageRange: [number, number];
  onChangeOfficerItems: (values: string[]) => void;
  onChangeMarriageItems: (values: string[]) => void;
  onChangeBaptismItems: (values: string[]) => void;
  onChangeRegisterAfter: (date: Date | null) => void;
  onChangeRegisterBefore: (date: Date | null) => void;
  onChangeAgeRange: (values: [number, number]) => void;
};

const MemberTableHeaderSettingView = ({
  ageRange,
  onChangeOfficerItems,
  onChangeMarriageItems,
  onChangeBaptismItems,
  onChangeRegisterAfter,
  onChangeRegisterBefore,
  onChangeAgeRange,
}: TableSettingViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const { officers } = useSelector((state: RootState) => state.church);

  const officerCheckListItems: CheckButtonValue[] = officers.map((officer) => ({
    value: officer.id,
    title: officer.name,
  }));

  const marriageCheckListItems: CheckButtonValue[] = useMarriageDropdownItems();
  const baptismCheckListItems: CheckButtonValue[] = useBaptismDropdownItems();

  return (
    <TableSettingContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('officer')}</MainText>
        <CheckButtonList
          values={memberFilter.officer}
          onChange={onChangeOfficerItems}
          items={officerCheckListItems}
        />
      </LabelContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('marriage')}</MainText>
        <CheckButtonList
          values={memberFilter.marriage}
          onChange={onChangeMarriageItems}
          items={marriageCheckListItems}
        />
      </LabelContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('baptism')}</MainText>
        <CheckButtonList
          values={memberFilter.baptism}
          onChange={onChangeBaptismItems}
          items={baptismCheckListItems}
        />
      </LabelContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('age')}</MainText>
        <CustomSlider
          min={1}
          max={100}
          values={ageRange}
          onChange={onChangeAgeRange}
        />
        <RangeContainer>
          <AgeRangeTitle>
            <MainText
              color={MAIN.DEFAULT}
            >{`${getTranslatedAge(locale, ageRange[0])} - ${getTranslatedAge(locale, ageRange[1])}`}</MainText>
          </AgeRangeTitle>
        </RangeContainer>
      </LabelContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('registeredAt')}</MainText>
        <RowContainer>
          <CustomDatePicker
            value={
              memberFilter.registerAfter
                ? getDateStringFromDate(
                    getDateFromInput(memberFilter.registerAfter)
                  )
                : undefined
            }
            selected={
              memberFilter.registerAfter
                ? getDateFromDateString(memberFilter.registerAfter)
                : null
            }
            onChange={onChangeRegisterAfter}
            placeholderText={t('startDate')}
            borderColor={GRAY.LIGHT}
          />
          <CustomDatePicker
            value={
              memberFilter.registerBefore
                ? getDateStringFromDate(
                    getDateFromInput(memberFilter.registerBefore)
                  )
                : undefined
            }
            selected={
              memberFilter.registerBefore
                ? getDateFromDateString(memberFilter.registerBefore)
                : null
            }
            onChange={onChangeRegisterBefore}
            placeholderText={t('endDate')}
            borderColor={GRAY.LIGHT}
          />
        </RowContainer>
      </LabelContainer>
    </TableSettingContainer>
  );
};

export default MemberTableHeaderSettingView;
