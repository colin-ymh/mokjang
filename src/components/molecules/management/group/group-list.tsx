import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Group } from '@/models/management/management';
import GroupListView from '@/components/molecules/management/group/group-list.view';
import { BLANK } from '@/constants/constant';
import { BLACK } from '@/constants/styles/color';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { GroupsApi } from '@/api/management/group/groups.api';

type GroupListProps = {
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
};

const GroupList = ({ selectedGroupId, setSelectedGroup }: GroupListProps) => {
  const { groups, churchId } = useSelector((state: RootState) => state.church);

  // 토스트 팝업
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);

  const groupsApi = new GroupsApi(false);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 그룹 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedGroups((prevClosedGroups) => {
      const newClosedGroups = new Set(prevClosedGroups);
      if (newClosedGroups.has(ID)) {
        newClosedGroups.delete(ID); // 이미 닫혀있으면 열기
      } else {
        newClosedGroups.add(ID); // 닫힌 상태로 추가
      }
      return newClosedGroups;
    });
  };

  // 그룹 클릭 이벤트
  const onClickGroup = async (groupId: string | null) => {
    if (!groupId) return;

    try {
      const response = await groupsApi.getGroup({ churchId, groupId });
      setSelectedGroup(response.data);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    list: {
      groups,
    },
    toast: {
      setIsToastShown,
      setToastText,
      setToastColor,
    },
    item: {
      closedGroups,
      selectedGroupId,
      onClickGroup,
      onClickToggle,
    },
  };

  return (
    <>
      <GroupListView {...props} />

      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={toastColor}
        />
      )}
    </>
  );
};

export default GroupList;
