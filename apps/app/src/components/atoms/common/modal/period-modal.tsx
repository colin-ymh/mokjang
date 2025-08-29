import React, { useState } from 'react';
import styled from 'styled-components';

import TransparentBackground from '../etc/transparent-background';
import Button from '../button/button';
import { BLACK, GRAY, WHITE } from '@/constants/styles/color';
import { getDateFromInput, getDateStringFromDate } from '@/utils/date';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { MainText } from '../text/main-text';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';

const ModalContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  position: absolute;

  z-index: 60;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  top: 50px;
  left: 10px;
`;

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
  padding: 10px;
  z-index: 50;
`;

const InputContainer = styled.div`
  display: flex;

  flex-direction: row;
  gap: 10px;
`;

type PeriodModalProps = {
  isShown: boolean;
  onClickClose: () => void;
  startDate: string;
  endDate: string;
  onClickSave: (startDate: string, endDate: string) => void;
};

const PeriodModal = ({
  isShown,
  onClickClose,
  startDate,
  endDate,
  onClickSave,
}: PeriodModalProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');

  const [innerStartDate, setInnerStartDate] = useState<string>(startDate);
  const [innerEndDate, setInnerEndDate] = useState<string>(endDate);

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      setInnerStartDate(newDate);
    }
  };

  const onChangeEndDate = (date: Date | null): void => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      setInnerEndDate(newDate);
    }
  };

  return (
    <ModalContainer $isShown={isShown}>
      <TransparentBackground
        isOpened={isShown}
        onClick={onClickClose}
        blur={false}
      />
      <PeriodContainer>
        <MainText>{t('period')}</MainText>
        <InputContainer>
          <CustomDatePicker
            value={innerStartDate}
            selected={startDate ? getDateFromInput(startDate) : null}
            onChange={onChangeStartDate}
            placeholderText={t('startDate')}
            // width={150}
          />
          <CustomDatePicker
            value={innerEndDate}
            selected={endDate ? getDateFromInput(endDate) : null}
            onChange={onChangeEndDate}
            placeholderText={t('endDate')}
            // width={150}
          />
          <Button
            text={t_button('setting')}
            onClick={() => onClickSave(innerStartDate, innerEndDate)}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
            color={BLACK}
            width={50}
          />
        </InputContainer>
      </PeriodContainer>
    </ModalContainer>
  );
};

export default PeriodModal;
