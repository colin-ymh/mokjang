import styled from 'styled-components';
import LabelInput from '../../../../../atoms/common/input/label-input';
import React from 'react';
import {
  useI18n,
  useScopedI18n,
} from '../../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import CustomDatePicker from '../../../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
} from '../../../../../../utils/date';
import { GRAY } from '../../../../../../constants/styles/color';
import { MainText } from '../../../../../atoms/common/text/main-text';
import { SIZE } from '../../../../../../constants/styles/style';
import DeleteWarningButton from '../../../../../atoms/common/button/delete-warning-button';

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
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

type EditMemberOfficerViewProps = {
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onClickDeleteOfficer: () => void;
};

const EditOfficerHistoryView = ({
  onChangeStartDate,
  onChangeEndDate,
  onClickDeleteOfficer,
}: EditMemberOfficerViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetOfficerHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  return (
    <>
      <EditMemberOfficerViewContainer>
        <LabelInput
          label={t('officer')}
          value={targetOfficerHistory.officerSnapShot}
          onChange={() => {}} // 필요하다면 구현
        />
        <RowContainer>
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

          {/* 종료 날짜 */}
          <LabelContainer>
            <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
              {t('endDate')}
            </MainText>
            <CustomDatePicker
              value={
                targetOfficerHistory.endDate
                  ? getDateStringFromDate(
                      getDateFromInput(targetOfficerHistory.endDate)
                    )
                  : undefined
              }
              selected={
                targetOfficerHistory.endDate
                  ? getDateFromDateString(targetOfficerHistory.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              maxDate={new Date()}
            />
          </LabelContainer>
        </RowContainer>
        <DeleteWarningButton
          description={t_warning('deleteOfficerHistory')}
          buttonText={t_button('deleteHistory')}
          onClick={onClickDeleteOfficer}
        />
      </EditMemberOfficerViewContainer>
    </>
  );
};

export default EditOfficerHistoryView;
