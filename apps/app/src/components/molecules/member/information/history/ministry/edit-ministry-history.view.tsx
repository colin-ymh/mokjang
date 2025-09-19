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

const EditMemberMinistryViewContainer = styled.div`
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

type EditMemberMinistryViewProps = {
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onClickDeleteMinistry: () => void;
};

const EditMinistryHistoryView = ({
  onChangeStartDate,
  onChangeEndDate,
  onClickDeleteMinistry,
}: EditMemberMinistryViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  return (
    <>
      <EditMemberMinistryViewContainer>
        <LabelInput
          label={t('ministryGroup')}
          value={targetMinistryHistory.ministryGroupSnapShot}
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
                targetMinistryHistory.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetMinistryHistory.startDate)
                    )
                  : undefined
              }
              selected={
                targetMinistryHistory.startDate
                  ? getDateFromDateString(targetMinistryHistory.startDate)
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
                targetMinistryHistory.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetMinistryHistory.endDate)
                    )
                  : undefined
              }
              selected={
                targetMinistryHistory.endDate
                  ? getDateFromDateString(targetMinistryHistory.endDate)
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
            description={t_warning('deleteMinistryHistory')}
            buttonText={t_button('deleteHistory')}
            onClick={onClickDeleteMinistry}
          />
        </BoxContainer>
      </EditMemberMinistryViewContainer>
    </>
  );
};

export default EditMinistryHistoryView;
