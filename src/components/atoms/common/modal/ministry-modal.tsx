import { ChangeEvent, useEffect, useState } from 'react';

import { BLANK } from '@/constants/constant';
import { MinistryHistory } from '@/models/member/history';
import {
  DEFAULT_MINISTRY_GROUP,
  Ministry,
  MinistryGroup,
} from '@/models/management/management';
import { getFormattedDate } from '@/utils/format';
import { getIsWellFormedDate } from '@/utils/check';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';

type MinistryModalProps = {
  isHistory: boolean;
  prevMinistry?: MinistryHistory;
  currentMinistry?: Ministry;
  onClickSaveCurrentMinistry?: (groupId: string, startDate: string) => void;
  onClickSaveMinistryHistory?: (startDate?: string, endDate?: string) => void;
};

const MinistryModal = ({
  isHistory,
  prevMinistry,
  currentMinistry,
  onClickSaveCurrentMinistry,
  onClickSaveMinistryHistory,
}: MinistryModalProps) => {
  // 선택된 그룹
  const [selectedMinistryGroup, setSelectedMinistryGroup] =
    useState<MinistryGroup>(DEFAULT_MINISTRY_GROUP);
  // 역할 선택지
  const [ministryDropdownItems, setMinistryDropdownItems] = useState<
    DropdownValueType[]
  >([]);

  // 선택된 역할
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>(
    currentMinistry ? currentMinistry.id : BLANK
  );

  // 시작 날짜
  const [startDate, setStartDate] = useState<string>(
    prevMinistry?.startDate ? getFormattedDate(prevMinistry.startDate) : BLANK
  );

  // 종료 날짜
  const [endDate, setEndDate] = useState<string>(
    prevMinistry?.endDate ? getFormattedDate(prevMinistry.endDate) : BLANK
  );

  // 저장 가능 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 그룹 설정 완료 버튼
  const onClickSaveMinistry = (ministryGroup: MinistryGroup) => {
    if (ministryGroup) {
      setSelectedMinistryGroup(ministryGroup);
    }
  };

  // 그룹 설정 완료 버튼
  const onChangeMinistryId = (id: string) => {
    if (id) {
      setSelectedMinistryId(id);
    }
  };

  // 시작 날짜 변경
  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newStartDate = getFormattedDate(event.target.value);
    setStartDate(newStartDate);
  };

  // 종료 날짜 변경
  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = getFormattedDate(event.target.value);
    setEndDate(newEndDate);
  };

  // 저장 가능 여부 확인
  useEffect(() => {
    if (isHistory) {
      if (
        getIsWellFormedDate(startDate) &&
        (getIsWellFormedDate(endDate) || endDate === BLANK)
      ) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    } else {
      if (selectedMinistryGroup.id && getIsWellFormedDate(startDate)) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // if (selectedMinistryGroup..length > 0) {
    //   const newItems = selectedMinistryGroup.ministrys.map((ministry) => {
    //     return {
    //       value: ministry.id,
    //       title: ministry.ministry,
    //     };
    //   });
    //
    //   setMinistryDropdownItems(newItems);
    // }
  }, [selectedMinistryGroup]);

  const props = {
    isHistory,
    prevMinistry,
    ministryDropdownItems,
    selectedMinistryGroup,
    selectedMinistryId,
    isButtonEnabled,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    onClickSaveMinistry,
    onChangeMinistryId,
    onClickSaveCurrentMinistry,
    onClickSaveMinistryHistory,
  };

  return <>{/*<MinistryModalView {...props} />*/}</>;
};

export default MinistryModal;
