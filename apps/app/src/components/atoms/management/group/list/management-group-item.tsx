import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { fetchGroups } from '../../../../../redux/reducers/church-reducer';

import { GroupsApi } from '../../../../../api/management/group/groups.api';
import AddGroup from './add-group';
import { BLANK } from '@mokjang/constants';
import ManagementGroupItemView from './management-group-item.view';
import { Group } from '@mokjang/models';
import { getFormattedTitle } from '@mokjang/utils';
import { getIsWellFormedTitle } from '@mokjang/utils';
import { useScopedI18n } from '../../../../../../locales/client';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';

type ManagementGroupItemProps = {
  group: Group;
  level: number;
  selectedGroupId: string | null;
  onClickGroup: (group: Group) => void;
  closedGroups: Set<number>;
  onClickToggle: (id: string) => void;
};

const ManagementGroupItem = ({
  group,
  level,
  selectedGroupId,
  onClickGroup,
  closedGroups,
  onClickToggle,
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

  // ----------------- 새로운 자식 그룹 추가 ----------------- //
  const newGroupRef = useRef<HTMLInputElement>(null);

  const [isAddShown, setIsAddShown] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>(BLANK);

  const onClickGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => newGroupRef.current?.focus());
  };

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
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // ----------------- 새로운 자식 그룹 추가 ----------------- //

  /**
   * 그룹 아이템 드롭 시 이벤트
   * @param draggedGroup 드래그 앤 드롭 되는 아이템
   * @param order 새로운 순서
   * @param newParentId 새로운 부모 ID
   */
  const onDropGroup = async (
    draggedGroup: Group,
    order: number,
    newParentId?: string | null
  ) => {
    try {
      // 부모 이동인 경우
      if (newParentId || newParentId === null) {
        await groupsApi.editGroupStructure(
          { churchId, groupId: draggedGroup.id as string },
          {
            parentGroupId: newParentId,
            order,
          }
        );
        await dispatch(fetchGroups());
      }
      // 부모 이동이 아닌 경우 -> 자식 간 순서 변경
      else {
        await groupsApi.editGroupStructure(
          { churchId, groupId: draggedGroup.id as string },
          {
            order,
          }
        );
        await dispatch(fetchGroups());
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else setThrownError(new Error(String(error)));
    }
  };

  // 새로운 자식 그룹 추가 창 마우스 이벤트
  useEffect(() => {
    const handleBlur = () => setIsAddShown(false);
    newGroupRef.current?.addEventListener('blur', handleBlur);
    return () => newGroupRef.current?.removeEventListener('blur', handleBlur);
  }, [isAddShown]);

  // 키보드 이벤트
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
    selectedGroupId,
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

      {/* 새로운 자식 그룹 생성 */}
      <AddGroup
        ref={newGroupRef}
        isShown={isAddShown}
        level={level}
        name={newGroupName}
        onChangeName={onChangeNewGroupName}
        onClickSaveGroup={onClickSaveNewGroup}
      />

      {/* 자식들 재귀 생성 */}
      {isOpen &&
        group.childGroups?.map((childGroup) => (
          <ManagementGroupItem
            key={childGroup.id}
            group={childGroup}
            level={level + 1}
            selectedGroupId={selectedGroupId}
            onClickGroup={onClickGroup}
            closedGroups={closedGroups}
            onClickToggle={onClickToggle}
          />
        ))}
    </>
  );
};

export default ManagementGroupItem;
