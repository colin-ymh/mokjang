import {
  BorderInput,
  Button,
  MainText,
} from '../../../../../../packages/components/src';
import {
  BLACK,
  BLANK,
  DESTRUCTIVE,
  GRAY,
  WHITE,
} from '../../../../../../packages/constants/src';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getIsWellFormedTitle } from '../../../../../../packages/utils/src';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { AppDispatch, RootState } from '@/redux/store';
import { GroupsApi } from '@/api/management/group/groups.api';
import { getFormattedTitle } from '@mokjang/utils';
import { fetchGroups } from '@/redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import GroupList from '@/components/molecules/management/group/list/group-list';

const GroupInitContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 30px;
  width: 700px;
  height: 850px;
`;

const AddContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

type GroupInitProps = {};

const GroupInit = ({}: GroupInitProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const t_init = useScopedI18n('register.churchInit');

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
    <GroupInitContainer>
      {/* 타이틀 */}
      <HeaderContainer>
        <MainText fontSize={24} fontWeight={700}>
          {t_init('group.title')}
        </MainText>
        <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
          {t_init('group.description')}
        </MainText>
      </HeaderContainer>
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
      <GroupList selectedGroupId={null} onClickGroup={(g: any) => {}} />
    </GroupInitContainer>
  );
};

export default GroupInit;
