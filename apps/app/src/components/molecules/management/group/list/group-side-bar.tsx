import { MainText } from '../../../../atoms/common/text/main-text';
import BorderInput from '../../../../atoms/common/input/border-input';
import {
  BLACK,
  DESTRUCTIVE,
  GRAY,
  WHITE,
} from '../../../../../constants/styles/color';
import Button from '../../../../atoms/common/button/button';
import GroupList from './group-list';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { Group } from '../../../../../models/management/management';
import { BLANK } from '../../../../../constants/constant';
import { getIsWellFormedTitle } from '../../../../../utils/check';
import { fetchGroups } from '../../../../../redux/reducers/church-reducer';
import { getFormattedTitle } from '../../../../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { GroupsApi } from '../../../../../api/management/group/groups.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.LIGHT};
  width: 300px;
  flex-shrink: 0;
  background-color: ${WHITE};
`;

const AddContainer = styled.div`
  display: flex;
  gap: 5px;
`;

type GroupSideBarProps = {
  selectedGroup: Group;
  onClickGroup: (group: Group) => void;
};

const GroupSideBar = ({ selectedGroup, onClickGroup }: GroupSideBarProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const groupsApi = new GroupsApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);

  // 새로 추가할 그룹명
  const [newGroupName, setNewGroupName] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeNewGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(getFormattedTitle(event.target.value));
  };

  const onClickSaveNewGroup = async () => {
    if (!getIsWellFormedTitle(newGroupName)) return;

    try {
      await groupsApi.createGroup({ churchId }, { name: newGroupName });
      await dispatch(fetchGroups());
      setNewGroupName(BLANK);
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        onClickSaveNewGroup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newGroupName]);

  return (
    <GroupListContainer>
      {/* 타이틀 */}
      <MainText fontSize={18} fontWeight={600}>
        {t('groupList')}
      </MainText>
      {/* 새 그룹 추가 창*/}
      <AddContainer>
        <BorderInput
          value={newGroupName}
          onChange={onChangeNewGroupName}
          borderColor={GRAY.SEMI_LIGHT}
        />
        <Button
          width={80}
          text={t('button.add')}
          onClick={onClickSaveNewGroup}
          borderColor={GRAY.SEMI_LIGHT}
          backgroundColor={WHITE}
          color={GRAY.DARK}
        />
      </AddContainer>
      {/* 그룹 목록 */}
      <GroupList
        selectedGroupId={selectedGroup.id}
        onClickGroup={onClickGroup}
      />
    </GroupListContainer>
  );
};

export default GroupSideBar;
