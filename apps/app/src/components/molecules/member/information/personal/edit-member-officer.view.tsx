import styled from 'styled-components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import CustomDatePicker from '../../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
} from '../../../../../utils/date';
import { GRAY } from '../../../../../constants/styles/color';
import { MainText } from '../../../../atoms/common/text/main-text';
import { SIZE } from '../../../../../constants/styles/style';
import StopWarningButton from '../../../../atoms/common/button/stop-warning-button';
import LabelDropdown from '../../../../atoms/common/dropdown/label-dropdown';

const EditMemberOfficerViewContainer = styled.div`
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

type EditMemberOfficerViewProps = {
  onClickDeleteOfficer: () => void;
  onChangeOfficer: (officerId: string) => void;
  onChangeStartDate: (date: Date | null) => void;
};

const EditMemberOfficerView = ({
  onClickDeleteOfficer,
  onChangeOfficer,
  onChangeStartDate,
}: EditMemberOfficerViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');

  const { officers } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetOfficerHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const officerDropdownItems = officers.map((officer) => {
    return { value: officer.id, title: officer.name };
  });

  return (
    <>
      <EditMemberOfficerViewContainer>
        <LabelDropdown
          label={t('officer')}
          value={
            targetOfficerHistory.officerSnapShot ||
            targetOfficerHistory.officer?.name
          }
          items={officerDropdownItems}
          onChangeItem={onChangeOfficer}
        />
        {/* 시작 날짜 */}
        <LabelContainer>
          <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
            {t('startDate')}
          </MainText>
          <CustomDatePicker
            value={
              targetOfficerHistory.startDate
                ? getDateStringFromDate(
                    getDateFromInput(targetOfficerHistory.startDate)
                  )
                : undefined
            }
            selected={
              targetOfficerHistory.startDate
                ? getDateFromDateString(targetOfficerHistory.startDate)
                : null
            }
            onChange={onChangeStartDate}
            placeholderText={t('startDate')}
            maxDate={new Date()}
          />
        </LabelContainer>
        {targetMember.officerHistory &&
          targetMember.officerHistory.length > 0 && (
            <StopWarningButton
              description={t_warning('stopOfficerHistory')}
              buttonText={t_button('stopOfficerHistory')}
              onClick={onClickDeleteOfficer}
              // disabled={!!selectedOfficer?.membersCount || false}
            />
          )}
      </EditMemberOfficerViewContainer>
    </>
  );
};

export default EditMemberOfficerView;
