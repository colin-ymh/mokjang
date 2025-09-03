import { MainText } from '@mokjang/components';
import { BorderInput } from '@mokjang/components';
import { BLACK, DESTRUCTIVE, GRAY, WHITE } from '@mokjang/constants';
import { Button } from '@mokjang/components';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { MinistryGroup } from '@mokjang/models';
import { BLANK } from '@mokjang/constants';
import { getIsWellFormedTitle } from '@mokjang/utils';
import { fetchMinistryGroups } from '../../../../../redux/reducers/church-reducer';
import { getFormattedTitle } from '@mokjang/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import MinistryGroupList from './ministry-group-list';
import { MinistryGroupsApi } from '../../../../../api/management/ministry/ministry-groups.api';

const MinistryGroupListContainer = styled.div`
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

type MinistryGroupSideBarProps = {
  selectedMinistryGroup: MinistryGroup;
  onClickMinistryGroup: (ministryGroup: MinistryGroup) => void;
};

const MinistryGroupSideBar = ({
  selectedMinistryGroup,
  onClickMinistryGroup,
}: MinistryGroupSideBarProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
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
      <MainText fontSize={18} fontWeight={600}>
        {t('ministryGroupList')}
      </MainText>
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
        selectedMinistryGroupId={selectedMinistryGroup.id}
        onClickMinistryGroup={onClickMinistryGroup}
      />
    </MinistryGroupListContainer>
  );
};

export default MinistryGroupSideBar;
