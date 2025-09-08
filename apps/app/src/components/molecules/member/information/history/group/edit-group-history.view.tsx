import styled from 'styled-components';
import { LabelInput, MainText } from '@mokjang/components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import CustomDatePicker from '../../../../../../vendor/date-picker/custom-date-picker';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { GRAY, SIZE } from '@mokjang/constants';
import DeleteWarningButton from '../../../../../atoms/common/button/delete-warning-button';

const EditMemberGroupViewContainer = styled.div`
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

type EditMemberGroupViewProps = {
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onClickDeleteGroup: () => void;
};

const EditGroupHistoryView = ({
  onChangeStartDate,
  onChangeEndDate,
  onClickDeleteGroup,
}: EditMemberGroupViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetGroupHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  return (
    <>
      <EditMemberGroupViewContainer>
        <LabelInput
          label={t('group')}
          value={targetGroupHistory.groupSnapShot}
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
                targetGroupHistory.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetGroupHistory.startDate)
                    )
                  : undefined
              }
              selected={
                targetGroupHistory.startDate
                  ? getDateFromDateString(targetGroupHistory.startDate)
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
                targetGroupHistory.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetGroupHistory.endDate)
                    )
                  : undefined
              }
              selected={
                targetGroupHistory.endDate
                  ? getDateFromDateString(targetGroupHistory.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              maxDate={new Date()}
            />
          </LabelContainer>
        </RowContainer>
        <DeleteWarningButton
          description={t_warning('deleteGroupHistory')}
          buttonText={t_button('deleteHistory')}
          onClick={onClickDeleteGroup}
        />
      </EditMemberGroupViewContainer>
    </>
  );
};

export default EditGroupHistoryView;
