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
import { getFormattedTitle } from '@/utils/format';
import { fetchMinistryGroups } from '@/redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import MinistryGroupList from '@/components/molecules/management/ministry/list/ministry-group-list';
import { MinistryGroup } from '@/models/management/management';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';

const MinistryGroupListContainer = styled.div`
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

type MinistryInitProps = {};

const MinistryInit = ({}: MinistryInitProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const t_init = useScopedI18n('register.churchInit');

  const dispatch = useDispatch<AppDispatch>();
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);

  // 새로 추가할 그룹명
  const [newMinistryGroupName, setNewMinistryGroupName] =
    useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeNewMinistryGroupName = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNewMinistryGroupName(getFormattedTitle(event.target.value));
  };

  const onClickSaveNewMinistryGroup = async () => {
    if (!getIsWellFormedTitle(newMinistryGroupName)) return;

    try {
      await ministryGroupsApi.createMinistryGroup(
        { churchId },
        { name: newMinistryGroupName, parentMinistryGroupId: null }
      );
      await dispatch(fetchMinistryGroups());
      setNewMinistryGroupName(BLANK);
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
        onClickSaveNewMinistryGroup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newMinistryGroupName]);

  return (
    <MinistryGroupListContainer>
      {/* 타이틀 */}
      <HeaderContainer>
        <MainText fontSize={24} fontWeight={700}>
          {t_init('ministry.title')}
        </MainText>
        <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
          {t_init('ministry.description')}
        </MainText>
      </HeaderContainer>
      {/* 새 그룹 추가 창*/}
      <AddContainer>
        <BorderInput
          value={newMinistryGroupName}
          onChange={onChangeNewMinistryGroupName}
          borderColor={GRAY.SEMI_LIGHT}
        />
        <Button
          width={80}
          text={t('button.add')}
          onClick={onClickSaveNewMinistryGroup}
          borderColor={GRAY.SEMI_LIGHT}
          backgroundColor={WHITE}
          color={GRAY.DARK}
        />
      </AddContainer>
      {/* 그룹 목록 */}
      <MinistryGroupList
        selectedMinistryGroupId={null}
        onClickMinistryGroup={(g: MinistryGroup) => {}}
      />
    </MinistryGroupListContainer>
  );
};

export default MinistryInit;
