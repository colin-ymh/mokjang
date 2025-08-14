import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchMinistryGroups } from '@/redux/reducers/church-reducer';

import { BLANK } from '@/constants/constant';

import { MinistryGroup } from '@/models/management/management';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { useScopedI18n } from '../../../../../../locales/client';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import ManagementMinistryGroupItemView from '@/components/atoms/management/ministry/list/management-ministry-group-item.view';
import AddMinistryGroup from '@/components/atoms/management/ministry/list/add-ministry-group';

type ManagementMinistryGroupItemProps = {
  ministryGroup: MinistryGroup;
  level: number;
  selectedMinistryGroupId: string | null;
  onClickMinistryGroup: (ministryGroup: MinistryGroup) => void;
  closedMinistryGroups: Set<number>;
  onClickToggle: (id: string) => void;
};

const ManagementMinistryMinistryGroupItem = ({
  ministryGroup,
  level,
  selectedMinistryGroupId,
  onClickMinistryGroup,
  closedMinistryGroups,
  onClickToggle,
}: ManagementMinistryGroupItemProps) => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const isHaveChildren =
    ministryGroup.childMinistryGroups &&
    ministryGroup.childMinistryGroups.length > 0;
  const isOpen = !closedMinistryGroups.has(
    parseInt(ministryGroup.id as string)
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // ----------------- 새로운 자식 그룹 추가 ----------------- //
  const newGroupRef = useRef<HTMLInputElement>(null);

  const [isAddShown, setIsAddShown] = useState<boolean>(false);
  const [newMinistryGroupName, setNewGroupName] = useState<string>(BLANK);

  const onClickMinistryGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => newGroupRef.current?.focus());
  };

  const onChangeNewMinistryGroupName = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNewGroupName(getFormattedTitle(event.target.value));
  };

  const onClickSaveNewMinistryGroup = async () => {
    if (!getIsWellFormedTitle(newMinistryGroupName)) return;

    try {
      await ministryGroupsApi.createMinistryGroup(
        { churchId },
        { name: newMinistryGroupName, parentMinistryGroupId: ministryGroup.id }
      );
      await dispatch(fetchMinistryGroups());
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
  const onDropMinistryGroup = async (
    draggedGroup: MinistryGroup,
    order: number,
    newParentId?: string | null
  ) => {
    try {
      // 부모 이동인 경우
      if (newParentId || newParentId === null) {
        await ministryGroupsApi.editMinistryGroupStructure(
          { churchId, ministryGroupId: draggedGroup.id as string },
          {
            parentMinistryGroupId: newParentId,
            order,
          }
        );
        await dispatch(fetchMinistryGroups());
      }
      // 부모 이동이 아닌 경우 -> 자식 간 순서 변경
      else {
        await ministryGroupsApi.editMinistryGroupStructure(
          { churchId, ministryGroupId: draggedGroup.id as string },
          {
            order,
          }
        );
        await dispatch(fetchMinistryGroups());
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
          onClickSaveNewMinistryGroup();
        }
      } else if (e.key === 'Escape') {
        if (newGroupRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newMinistryGroupName]);

  const props = {
    isHaveChildren,
    isOpen,
    selectedMinistryGroupId,
    ministryGroup,
    level,
    onDropMinistryGroup,
    onClickToggle,
    onClickMinistryGroup,
    onClickMinistryGroupAdd,
  };

  return (
    <>
      <ManagementMinistryGroupItemView {...props} />

      {/* 새로운 자식 그룹 생성 */}
      <AddMinistryGroup
        ref={newGroupRef}
        isShown={isAddShown}
        level={level}
        name={newMinistryGroupName}
        onChangeName={onChangeNewMinistryGroupName}
        onClickSaveGroup={onClickSaveNewMinistryGroup}
      />

      {/* 자식들 재귀 생성 */}
      {isOpen &&
        ministryGroup.childMinistryGroups?.map((childGroup) => (
          <ManagementMinistryMinistryGroupItem
            key={childGroup.id}
            ministryGroup={childGroup}
            level={level + 1}
            selectedMinistryGroupId={selectedMinistryGroupId}
            onClickMinistryGroup={onClickMinistryGroup}
            closedMinistryGroups={closedMinistryGroups}
            onClickToggle={onClickToggle}
          />
        ))}
    </>
  );
};

export default ManagementMinistryMinistryGroupItem;
