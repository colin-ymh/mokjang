import { BLANK, DESTRUCTIVE } from '@mokjang/constants';
import { useI18n } from '../../../../../../locales/client';
import { DEFAULT_MINISTRY, Ministry, MinistryGroup } from '@mokjang/models';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { getFormattedName } from '@mokjang/utils';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { MinistriesApi } from '../../../../../api/management/ministry/ministries.api';
import MinistryListView from './ministry-list.view';

type MinistryListProps = {
  ministries: Ministry[];
  selectedMinistryGroup: MinistryGroup;
  fetchMinistries: () => void;
};

const MinistryList = ({
  ministries,
  selectedMinistryGroup,
  fetchMinistries,
}: MinistryListProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const ministriesApi = new MinistriesApi(false);

  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  const [selectedMinistry, setSelectedMinistry] =
    useState<Ministry>(DEFAULT_MINISTRY);

  const [editName, setEditName] = useState<string>(BLANK);

  // 에러 처리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onChangeEditMinistryName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setEditName(newName);
  };

  const onClickAddModalOpen = () => {
    setIsAddShown(true);
  };

  const onClickAddModalClose = () => {
    setIsAddShown(false);
    setEditName(BLANK);
  };

  const onClickSaveNewMinistry = async () => {
    try {
      await ministriesApi.createMinistry(
        { churchId, ministryGroupId: selectedMinistryGroup.id as string },
        { name: editName }
      );
      fetchMinistries();
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsAddShown(false);
      setEditName(BLANK);
    }
  };

  const onClickMinistryItem = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setIsEditShown(true);
  };

  const onClickEditModalClose = () => {
    setIsEditShown(false);
    setEditName(BLANK);
    setSelectedMinistry(DEFAULT_MINISTRY);
  };

  const onClickSaveEditMinistry = async () => {
    try {
      await ministriesApi.editMinistry(
        {
          churchId,
          ministryId: selectedMinistry.id as string,
          ministryGroupId: selectedMinistryGroup.id as string,
        },
        { name: editName }
      );
      fetchMinistries();
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsEditShown(false);
      setEditName(BLANK);
      setSelectedMinistry(DEFAULT_MINISTRY);
    }
  };

  useEffect(() => {
    if (selectedMinistry.name) {
      setEditName(selectedMinistry.name);
    }
  }, [selectedMinistry]);

  const props = {
    ministries,
    fetchMinistries,
    isAddShown,
    isEditShown,
    editName,
    onClickAddModalOpen,
    onClickAddModalClose,
    onClickSaveNewMinistry,
    onChangeEditMinistryName,
    onClickMinistryItem,
    onClickEditModalClose,
    onClickSaveEditMinistry,
    selectedMinistry,
  };

  return (
    <>
      <MinistryListView {...props} />
    </>
  );
};

export default MinistryList;
