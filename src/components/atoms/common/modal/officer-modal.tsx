import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import OfficerModalView from '@/components/atoms/common/modal/officer-modal.view';
import { BLANK, NONE } from '@/constants/constant';
import { OfficerHistory } from '@/models/member/history';
import { getFormattedDate } from '@/utils/format';
import { getIsWellFormedDate } from '@/utils/check';

type OfficerModalProps = {
  targetHistory?: OfficerHistory;
  onClickSaveNewOfficer?: (officerId: string, startDate: string) => void;
  onClickSaveOfficerHistory?: (startDate?: string, endDate?: string) => void;
};

const OfficerModal = ({
  targetHistory,
  onClickSaveNewOfficer,
  onClickSaveOfficerHistory,
}: OfficerModalProps) => {
  const officers = useSelector((state: RootState) => state.church.officers);
  // 선택된 역할
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(NONE);

  // 시작 날짜
  const [startDate, setStartDate] = useState<string>(BLANK);

  // 종료 날짜
  const [endDate, setEndDate] = useState<string>(BLANK);

  // 저장 가능 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 그룹 설정 완료 버튼
  const onChangeOfficerId = (id: string) => {
    if (id) {
      setSelectedOfficerId(id);
    }
  };

  const onClickCancelOfficer = () => {
    setSelectedOfficerId(NONE);
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
    if (targetHistory !== undefined && selectedOfficerId === NONE) {
      setIsButtonEnabled(true);
    }
    //   생성 시
    else if (!targetHistory) {
      setIsButtonEnabled(
        selectedOfficerId !== NONE && getIsWellFormedDate(startDate)
      );
    }
    //   현재 이력 수정 시
    else if (!targetHistory?.endDate) {
      setIsButtonEnabled(getIsWellFormedDate(startDate));
    }
    //   과거 이력 수정 시
    else if (targetHistory?.endDate) {
      setIsButtonEnabled(
        getIsWellFormedDate(startDate) && getIsWellFormedDate(endDate)
      );
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // 목표 이력이 존재 X => 생성

    if (targetHistory) {
      // 목표 이력이 존재 O
      // && endDate가 X => 현재 이력 수정
      // ==> 직분 + 시작날짜 수정 가능
      if (!targetHistory.endDate) {
        const targetOfficer = officers.find(
          (officer) => officer.name === targetHistory.officerSnapShot
        );
        const targetStartDate = getFormattedDate(targetHistory.startDate);

        if (targetOfficer) setSelectedOfficerId(targetOfficer.id);
        if (targetStartDate) setStartDate(targetStartDate);
      }

      // 목표 이력이 존재 O
      // && endDate가 O => 과거 이력 수정
      // ==> 시작날짜  + 종료날짜 수정 가능
      else if (targetHistory.endDate) {
        const targetStartDate = getFormattedDate(targetHistory.startDate);
        const targetEndDate = getFormattedDate(targetHistory.endDate);

        if (targetStartDate) setStartDate(targetStartDate);
        if (targetEndDate) setEndDate(targetEndDate);
      }
    }
  }, [targetHistory]);

  const props = {
    targetHistory,
    selectedOfficerId,
    isButtonEnabled,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    onChangeOfficerId,
    onClickSaveNewOfficer,
    onClickSaveOfficerHistory,
    onClickCancelOfficer,
  };

  return (
    <>
      <OfficerModalView {...props} />
    </>
  );
};

export default OfficerModal;
