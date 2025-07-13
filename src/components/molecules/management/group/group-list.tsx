import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Group } from '@/models/management/management';
import GroupListView from '@/components/molecules/management/group/group-list.view';
import { BLANK } from '@/constants/constant';
import { BLACK } from '@/constants/styles/color';

type GroupListProps = {
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
};

const GroupList = ({ selectedGroupId, setSelectedGroup }: GroupListProps) => {
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);

  const { groups } = useSelector((state: RootState) => state.church);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

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

  const props = {
    isToastShown,
    toastText,
    toastColor,
    setIsToastShown,
    setToastText,
    setToastColor,
    groups,
    closedGroups,
    selectedGroupId,
    setSelectedGroup,
    onClickToggle,
  };
  return (
    <>
      <GroupListView {...props} />
    </>
  );
};

export default GroupList;
