import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchGroups } from '@/redux/reducers/church-reducer';

import { GroupsApi } from '@/api/management/group/groups.api';
import AddGroup from '@/components/atoms/management/group/add-group';
import { BLANK } from '@/constants/constant';
import ManagementGroupItemView from '@/components/atoms/management/group/management-group-item.view';
import { Group } from '@/models/management/management';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { useScopedI18n } from '../../../../../locales/client';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';

type ManagementGroupItemProps = {
  group: Group;
  level: number;
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  closedGroups: Set<number>;
  onClickToggle: (id: string) => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
  setToastText: Dispatch<SetStateAction<string>>;
  setToastColor: Dispatch<SetStateAction<string>>;
};

const ManagementGroupItem = ({
  group,
  level,
  selectedGroupId,
  setSelectedGroup,
  closedGroups,
  onClickToggle,
  setIsToastShown,
  setToastText,
  setToastColor,
}: ManagementGroupItemProps) => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const isHaveChildren = group.childGroups && group.childGroups.length > 0;
  const isOpen = !closedGroups.has(parseInt(group.id as string));

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const newGroupRef = useRef<HTMLInputElement>(null);

  const [isAddShown, setIsAddShown] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>(BLANK);

  const onChangeNewGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(getFormattedTitle(event.target.value));
  };

  const onClickSaveNewGroup = async () => {
    if (!getIsWellFormedTitle(newGroupName)) return;

    try {
      await groupsApi.createGroup(
        { churchId },
        { name: newGroupName, parentGroupId: group.id }
      );
      await dispatch(fetchGroups());
      setIsAddShown(false);
      setNewGroupName(BLANK);
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickGroup = async (groupId: string | null) => {
    if (!groupId) return;

    try {
      const response = await groupsApi.getGroup({ churchId, groupId });
      setSelectedGroup(response.data);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => newGroupRef.current?.focus());
  };

  /**
   * 그룹 아이템 드롭 시 이벤트
   * @param draggedGroup 드래그 앤 드롭 되는 아이템
   * @param order 새로운 순서
   * @param canNest 부모 변경 여부
   */
  const onDropGroup = async (
    draggedGroup: Group,
    order: number,
    canNest: boolean
  ) => {
    // 자기 자신으로는 드롭 불가
    if (draggedGroup.id === group.id) return;
    // 순서 버그 방지
    if (order < 1) return;

    try {
      // 부모 이동인 경우
      if (canNest) {
        // 이미 대상이 부모인 경우는 제외
        if (draggedGroup.parentGroupId !== group.id) {
          await groupsApi.editGroupStructure(
            { churchId, groupId: draggedGroup.id as string },
            {
              parentGroupId: group.id,
              order,
            }
          );
          await dispatch(fetchGroups());
        }
      }
      // 부모 이동이 아닌 경우 -> 자식 간 순서 변경
      else {
        // 부모가 다른 경우는 제외
        if (draggedGroup.parentGroupId === group.parentGroupId) {
          await groupsApi.editGroupStructure(
            { churchId, groupId: draggedGroup.id as string },
            {
              order,
            }
          );
          await dispatch(fetchGroups());
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
        setToastColor(DESTRUCTIVE.LIGHT);
        setIsToastShown(true);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    const handleBlur = () => setIsAddShown(false);
    newGroupRef.current?.addEventListener('blur', handleBlur);
    return () => newGroupRef.current?.removeEventListener('blur', handleBlur);
  }, [isAddShown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        if (newGroupRef.current === document.activeElement) {
          onClickSaveNewGroup();
        }
      } else if (e.key === 'Escape') {
        if (newGroupRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newGroupName]);

  const props = {
    isHaveChildren,
    isOpen,
    group,
    level,
    onDropGroup,
    onClickToggle,
    onClickGroup,
    onClickGroupAdd,
  };

  return (
    <>
      <ManagementGroupItemView {...props} />

      <AddGroup
        ref={newGroupRef}
        isShown={isAddShown}
        level={level}
        name={newGroupName}
        onChangeName={onChangeNewGroupName}
        onClickSaveGroup={onClickSaveNewGroup}
      />
      {isOpen &&
        group.childGroups?.map((childGroup) => (
          <ManagementGroupItem
            key={childGroup.id}
            group={childGroup}
            level={level + 1}
            selectedGroupId={selectedGroupId}
            setSelectedGroup={setSelectedGroup}
            closedGroups={closedGroups}
            onClickToggle={onClickToggle}
            setToastColor={setToastColor}
            setIsToastShown={setIsToastShown}
            setToastText={setToastText}
          />
        ))}
    </>
  );
};

export default ManagementGroupItem;
