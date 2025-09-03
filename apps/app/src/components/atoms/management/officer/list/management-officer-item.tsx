import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { fetchOfficers } from '../../../../../redux/reducers/church-reducer';

import { OfficersApi } from '../../../../../api/management/officer/officers.api';
import ManagementOfficerItemView from './management-officer-item.view';
import { Officer } from '../../../../../models/management/management';
import { DESTRUCTIVE } from '../../../../../constants/styles/color';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';

type ManagementOfficerItemProps = {
  officer: Officer;
  level: number;
  selectedOfficerId: string | null;
  onClickOfficer: (officer: Officer) => void;
};

const ManagementOfficerItem = ({
  officer,
  level,
  selectedOfficerId,
  onClickOfficer,
}: ManagementOfficerItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const officersApi = new OfficersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  /**
   * 그룹 아이템 드롭 시 이벤트
   * @param draggedOfficer 드래그 앤 드롭 되는 아이템
   * @param order 새로운 순서
   */
  const onDropOfficer = async (draggedOfficer: Officer, order: number) => {
    try {
      await officersApi.editOfficerStructure(
        { churchId, officerId: draggedOfficer.id as string },
        {
          order,
        }
      );
      await dispatch(fetchOfficers());
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

  const props = {
    officer,
    selectedOfficerId,
    level,
    onDropOfficer,
    onClickOfficer,
  };

  return (
    <>
      <ManagementOfficerItemView {...props} />
    </>
  );
};

export default ManagementOfficerItem;
