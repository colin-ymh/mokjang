import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useI18n } from '../../../../../locales/client';
import {
  CheckButtonList,
  CheckButtonValue,
  MainText,
} from '@mokjang/components';
import {
  useBaptismDropdownItems,
  useMarriageDropdownItems,
} from '../../../../hooks/dropdown/dropdown-items';
import CustomDatePicker from '../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getTranslatedAge,
} from '@mokjang/utils';
import { BAPTISM, GRAY, LOCALE, MAIN, MARRIAGE } from '@mokjang/constants';
import CustomSlider from '../../../atoms/common/slider/custom-slider';
import { usePathname } from 'next/navigation';

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

const BOTTOM = styled.div`
  display: flex;
  height: 100px;
`;

type TableSettingViewProps = {
  ageRange: [number, number];
  onChangeOfficerItems: (values: (string | null)[]) => void;
  onChangeMarriageItems: (values: (MARRIAGE | null)[]) => void;
  onChangeBaptismItems: (values: BAPTISM[]) => void;
  onChangeRegisteredFrom: (date: Date | null) => void;
  onChangeRegisteredTo: (date: Date | null) => void;
  onChangeAgeRange: (values: [number, number]) => void;
};

const MemberTableHeaderSettingView = ({
  ageRange,
  onChangeOfficerItems,
  onChangeMarriageItems,
  onChangeBaptismItems,
  onChangeRegisteredFrom,
  onChangeRegisteredTo,
  onChangeAgeRange,
}: TableSettingViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const { officers } = useSelector((state: RootState) => state.church);

  const OFFICER_NONE_ITEM = {
    value: 'null',
    title: t('officerNone'),
  };

  const officerCheckListItems: CheckButtonValue[] = [
    ...officers.map((officer) => ({
      value: officer.id,
      title: officer.name,
    })),
    OFFICER_NONE_ITEM,
  ];

  const marriageCheckListItems: CheckButtonValue[] = useMarriageDropdownItems();

  const baptismCheckListItems: CheckButtonValue[] = useBaptismDropdownItems();

  return (
    <TableSettingContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('officer')}</MainText>
        <CheckButtonList
          values={memberFilter.officerIds}
          onChange={onChangeOfficerItems}
          items={officerCheckListItems}
        />
      </LabelContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('marriage')}</MainText>
        <CheckButtonList
          values={memberFilter.marriageStatuses}
          onChange={onChangeMarriageItems}
          items={marriageCheckListItems}
        />
      </LabelContainer>
      <LabelContainer>
        <MainText fontWeight={600}>{t('baptism')}</MainText>
        <CheckButtonList
          values={memberFilter.baptismStatuses}
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
              memberFilter.registeredFrom
                ? getDateStringFromDate(
                    getDateFromDateString(memberFilter.registeredFrom)
                  )
                : undefined
            }
            selected={
              memberFilter.registeredFrom
                ? getDateFromDateString(memberFilter.registeredFrom)
                : null
            }
            onChange={onChangeRegisteredFrom}
            placeholderText={t('startDate')}
            borderColor={GRAY.LIGHT}
          />
          <CustomDatePicker
            value={
              memberFilter.registeredTo
                ? getDateStringFromDate(
                    getDateFromDateString(memberFilter.registeredTo)
                  )
                : undefined
            }
            selected={
              memberFilter.registeredTo
                ? getDateFromDateString(memberFilter.registeredTo)
                : null
            }
            onChange={onChangeRegisteredTo}
            placeholderText={t('endDate')}
            borderColor={GRAY.LIGHT}
          />
        </RowContainer>
        <BOTTOM />
      </LabelContainer>
    </TableSettingContainer>
  );
};

export default MemberTableHeaderSettingView;
