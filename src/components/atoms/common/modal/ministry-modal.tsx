import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { BLANK, NONE } from '@/constants/constant';
import { getFormattedDate, getFormattedTitle } from '@/utils/format';
import { getIsWellFormedDate, getIsWellFormedTitle } from '@/utils/check';
import {
  DEFAULT_MINISTRY_GROUP,
  Ministry,
  MinistryGroup,
} from '@/models/management/management';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import { MinistryHistory } from '@/models/member/history';
import MinistryModalView from '@/components/atoms/common/modal/ministry-modal.view';
import { CUSTOM_VALUE } from '@/components/atoms/common/dropdown/dropdown';

type MinistryGroupModalProps = {
  targetMemberId: string;
  targetHistory?: MinistryHistory;
  onClickSaveNewMinistry?: (
    ministryGroupId: string,
    ministryId: string,
    startDate: string
  ) => void;
  onClickSaveMinistryHistory?: (startDate?: string, endDate?: string) => void;
  onClickCreateMinistry?: (
    ministryGroupId: string,
    startDate: string,
    newName: string
  ) => void;
};

const MinistryGroupModal = ({
  targetMemberId,
  targetHistory,
  onClickSaveNewMinistry,
  onClickSaveMinistryHistory,
  onClickCreateMinistry,
}: MinistryGroupModalProps) => {
  const ministriesApi = new MinistriesApi(false);
  const { ministryGroups, churchId } = useSelector(
    (state: RootState) => state.church
  );

  // 선택된 사역 그룹
  const [selectedMinistryGroup, setSelectedMinistryGroup] =
    useState<MinistryGroup>(DEFAULT_MINISTRY_GROUP);

  // 역할 목록
  const [ministryItems, setMinistryItems] = useState<DropdownValueType[]>([]);

  // 새로 추가할 사역
  const [newMinistryName, setNewMinistryName] = useState<string>(BLANK);

  // 선택된 사역 역할
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>(BLANK);

  // 사역 시작 날짜
  const [startDate, setStartDate] = useState<string>(BLANK);

  // 사역 종료 날짜
  const [endDate, setEndDate] = useState<string>(BLANK);

  // 저장 가능 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 그룹 선택 모달
  const [isSelectOpened, setIsSelectOpened] = useState<boolean>(false);

  // 그룹 모달 닫기
  const onClickClose = () => {
    setIsSelectOpened(false);
  };

  // 그룹 모달 열기
  const onClickOpen = () => {
    setIsSelectOpened(true);
  };

  useEffect(() => {
    setIsSelectOpened(false);
  }, [targetMemberId]);

  // 추가할 사역 변경
  const onChangeCustomInput = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    setNewMinistryName(newName);
  };

  // 사역 그룹 설정 완료 버튼
  const onChangeMinistryGroup = (ministryGroup: MinistryGroup) => {
    setSelectedMinistryGroup(ministryGroup);
  };

  const onClickCancelMinistryGroup = () => {
    setSelectedMinistryGroup(DEFAULT_MINISTRY_GROUP);
  };

  // 사역 드롭다운 설정 완료 버튼
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
    if (
      selectedMinistryId === CUSTOM_VALUE &&
      !getIsWellFormedTitle(newMinistryName)
    ) {
      setIsButtonEnabled(false);
    } else if (
      targetHistory?.id !== BLANK &&
      selectedMinistryGroup.id === BLANK
    ) {
      setIsButtonEnabled(true);
    }
    // 생성 시
    else if (!targetHistory) {
      setIsButtonEnabled(
        selectedMinistryId !== NONE && getIsWellFormedDate(startDate)
      );
    }
    // 현재 이력 수정 시
    else if (!targetHistory?.endDate) {
      setIsButtonEnabled(getIsWellFormedDate(startDate));
    }
    // 과거 이력 수정 시
    else if (targetHistory?.endDate) {
      setIsButtonEnabled(
        getIsWellFormedDate(startDate) && getIsWellFormedDate(endDate)
      );
    }
  }, [selectedMinistryId, newMinistryName, startDate, endDate]);

  useEffect(() => {
    if (targetHistory) {
      // 목표 이력이 존재 O
      // && endDate가 X => 현재 이력 수정
      // ==> 직분 + 역할 + 시작날짜 수정 가능
      if (!targetHistory.endDate) {
        const targetHistoryGroupNameItems =
          targetHistory.ministryGroupSnapShot.split('__');

        const targetMinistryGroup = ministryGroups.find(
          (ministryGroup) =>
            ministryGroup.name ===
            targetHistoryGroupNameItems[targetHistoryGroupNameItems.length - 1]
        );

        const targetMinistryId = ministryItems.find(
          (item) => item.title === targetHistory.ministrySnapShot
        )?.value;

        const targetStartDate = getFormattedDate(targetHistory.startDate);

        if (targetMinistryId) setSelectedMinistryId(targetMinistryId);

        if (targetMinistryGroup) setSelectedMinistryGroup(targetMinistryGroup);

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
    } else {
      setSelectedMinistryId(NONE);
      setSelectedMinistryGroup(DEFAULT_MINISTRY_GROUP);
      setStartDate(BLANK);
      setEndDate(BLANK);
    }
  }, [targetHistory]);

  // 그룹 변경 시, 역할 드롭다운 내용 변경
  useEffect(() => {
    if (selectedMinistryGroup?.id) {
      ministriesApi
        .getMinistries({ churchId, ministryGroupId: selectedMinistryGroup.id })
        .then((response) => {
          const newMinistries: Ministry[] = response.data;
          const newMinistryItems = newMinistries
            .filter(
              (ministry) =>
                ministry.ministryGroupId === selectedMinistryGroup.id
            )
            .map((ministry) => {
              return { value: ministry.id, title: ministry.name };
            });
          if (newMinistryItems.length !== 0) {
            setSelectedMinistryId(newMinistryItems[0].value);
          } else {
            setSelectedMinistryId(BLANK);
          }
          setMinistryItems(newMinistryItems);
        });
    }
  }, [selectedMinistryGroup]);

  const props = {
    targetHistory,
    selectedMinistryGroup,
    ministryItems,
    newMinistryName,
    selectedMinistryId,
    isButtonEnabled,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    onChangeMinistryGroup,
    onChangeMinistryId,
    onClickSaveNewMinistry,
    onClickSaveMinistryHistory,
    onClickCancelMinistryGroup,
    onChangeCustomInput,
    onClickCreateMinistry,
    isSelectOpened,
    onClickOpen,
    onClickClose,
  };

  return (
    <>
      <MinistryModalView {...props} />
    </>
  );
};

export default MinistryGroupModal;
