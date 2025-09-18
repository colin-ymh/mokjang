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

const EditGroupDetailHistoryViewContainer = styled.div`
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

const BoxContainer = styled.div`
  display: flex;
`;

type EditGroupDetailHistoryViewProps = {
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onClickDeleteGroup: () => void;
};

const EditGroupDetailHistoryView = ({
  onChangeStartDate,
  onChangeEndDate,
  onClickDeleteGroup,
}: EditGroupDetailHistoryViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetGroupDetailHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  return (
    <>
      <EditGroupDetailHistoryViewContainer>
        <LabelInput
          label={t('groupRole')}
          value={t('groupLeader')}
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
                targetGroupDetailHistory.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetGroupDetailHistory.startDate)
                    )
                  : undefined
              }
              selected={
                targetGroupDetailHistory.startDate
                  ? getDateFromDateString(targetGroupDetailHistory.startDate)
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
                targetGroupDetailHistory.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetGroupDetailHistory.endDate)
                    )
                  : undefined
              }
              selected={
                targetGroupDetailHistory.endDate
                  ? getDateFromDateString(targetGroupDetailHistory.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              maxDate={new Date()}
            />
          </LabelContainer>
        </RowContainer>
        <BoxContainer>
          <DeleteWarningButton
            description={t_warning('deleteGroupHistory')}
            buttonText={t_button('deleteHistory')}
            onClick={onClickDeleteGroup}
          />
        </BoxContainer>
      </EditGroupDetailHistoryViewContainer>
    </>
  );
};

export default EditGroupDetailHistoryView;
