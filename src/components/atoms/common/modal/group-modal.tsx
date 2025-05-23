import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import GroupModalView from '@/components/atoms/common/modal/group-modal.view';
import { BLANK, NONE } from '@/constants/constant';
import { GroupHistory } from '@/models/member/history';
import { getFormattedDate } from '@/utils/format';
import { getIsWellFormedDate } from '@/utils/check';
import {
  DEFAULT_GROUP,
  Group,
  GroupRole,
} from '@/models/management/management';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { GroupRolesApi } from '@/api/management/group/group-roles.api';

type GroupModalProps = {
  targetMemberId: string;
  targetHistory?: GroupHistory;
  onClickSaveNewGroup?: (
    groupId: string,
    groupRoleId: string,
    startDate: string
  ) => void;
  onClickSaveGroupHistory?: (startDate?: string, endDate?: string) => void;
};

const GroupModal = ({
  targetMemberId,
  targetHistory,
  onClickSaveNewGroup,
  onClickSaveGroupHistory,
}: GroupModalProps) => {
  const groupRolesApi = new GroupRolesApi(false);
  const { groups, churchId } = useSelector((state: RootState) => state.church);
  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 역할 목록
  const [roleItems, setRoleItems] = useState<DropdownValueType[]>([]);

  // 선택된 그룹 역할
  const [selectedRoleId, setSelectedRoleId] = useState<string>(NONE);

  // 그룹 시작 날짜
  const [startDate, setStartDate] = useState<string>(BLANK);

  // 그룹 종료 날짜
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

  // 그룹 그룹 설정 완료 버튼
  const onChangeGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  const onClickCancelGroup = () => {
    setSelectedGroup(DEFAULT_GROUP);
  };

  // 그룹 드롭다운 설정 완료 버튼
  const onChangeRoleId = (id: string) => {
    if (id) {
      setSelectedRoleId(id);
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
    if (targetHistory?.id !== BLANK && selectedGroup.id === BLANK) {
      setIsButtonEnabled(true);
    }
    // 생성 시
    if (!targetHistory) {
      setIsButtonEnabled(
        selectedRoleId !== NONE && getIsWellFormedDate(startDate)
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
  }, [startDate, endDate]);

  useEffect(() => {
    if (targetHistory) {
      // 목표 이력이 존재 O
      // && endDate가 X => 현재 이력 수정
      // ==> 직분 + 역할 + 시작날짜 수정 가능
      if (!targetHistory.endDate) {
        const targetGroup = groups.find(
          (group) => group.id === targetHistory.groupId
        );

        const targetRoleId = targetHistory.groupRoleId;

        const targetStartDate = getFormattedDate(targetHistory.startDate);

        if (targetRoleId) setSelectedRoleId(targetRoleId);

        if (targetGroup) setSelectedGroup(targetGroup);

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

    // 목표 이력이 존재 X
    else {
      setSelectedGroup(DEFAULT_GROUP);
      setSelectedRoleId(NONE);
      setStartDate(BLANK);
      setEndDate(BLANK);
    }
  }, [targetHistory]);

  // 그룹 변경 시, 역할 드롭다운 내용 변경
  useEffect(() => {
    if (selectedGroup?.id) {
      groupRolesApi
        .getGroupRoles({ churchId, groupId: selectedGroup.id })
        .then((response) => {
          const newRoles: GroupRole[] = response.data.data;
          const newRoleItems = newRoles.map((role) => {
            return { value: role.id, title: role.role };
          });
          if (newRoleItems.length !== 0) {
            setSelectedRoleId(newRoleItems[0].value);
          } else {
            setSelectedRoleId(BLANK);
          }
          setRoleItems(newRoleItems);
        });
    }
  }, [selectedGroup]);

  const props = {
    targetHistory,
    selectedGroup,
    roleItems,
    selectedRoleId,
    isButtonEnabled,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    onChangeGroup,
    onChangeRoleId,
    onClickSaveNewGroup,
    onClickSaveGroupHistory,
    onClickCancelGroup,
    isSelectOpened,
    onClickOpen,
    onClickClose,
  };

  return (
    <>
      <GroupModalView {...props} />
    </>
  );
};

export default GroupModal;
