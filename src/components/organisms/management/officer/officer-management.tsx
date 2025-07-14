import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { OfficersApi } from '@/api/management/officer/officers.api';
import OfficerManagementView from '@/components/organisms/management/officer/officer-management.view';
import { DEFAULT_GROUP, Officer } from '@/models/management/management';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchOfficers } from '@/redux/reducers/church-reducer';
import { BLANK } from '@/constants/constant';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../locales/client';

type OfficerManagementProps = {};

const OfficerManagement = ({}: OfficerManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const t_popup = useScopedI18n('popup');
  const { churchId, officers } = useSelector(
    (state: RootState) => state.church
  );

  const officersApi = new OfficersApi(false);

  // 새로 추가할 그룹명
  const [newOfficerName, setNewOfficerName] = useState<string>(BLANK);

  // 수정할 그룹명
  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(BLANK);

  const [isDeleteShown, setIsDeleteShown] = useState<boolean>(false);

  // 선택된 그룹
  const [selectedOfficer, setSelectedOfficer] =
    useState<Officer>(DEFAULT_GROUP);

  // 에러 처리
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickDeleteOpen = () => {
    setIsDeleteShown(true);
  };

  const onClickDeleteClose = () => {
    setIsDeleteShown(false);
  };

  const onClickDelete = async () => {
    try {
      await officersApi
        .deleteOfficer({
          churchId,
          officerId: selectedOfficer.id as string,
        })
        .then(() => {
          setSelectedOfficer(DEFAULT_GROUP);
        });

      await dispatch(fetchOfficers());

      setToastText(t_popup('deleteComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
        setToastColor(DESTRUCTIVE.LIGHT);
        setIsToastShown(true);
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsDeleteShown(false);
    }
  };

  const onClickEditOpen = () => {
    setIsEditShown(true);
  };

  const onClickEditClose = () => {
    setIsEditShown(false);
  };

  const onChangeNewOfficerName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewOfficerName(getFormattedTitle(event.target.value));
  };

  const onChangeEditOfficerName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onClickSaveEdit = async () => {
    if (!getIsWellFormedTitle(editName)) {
      return;
    }

    try {
      const response = await officersApi.editOfficerName(
        { churchId, officerId: selectedOfficer.id as string },
        { name: editName }
      );
      await dispatch(fetchOfficers());
      setSelectedOfficer(response.data);
      setIsEditShown(false);
      setEditName(BLANK);
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
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

  const onClickSaveNewOfficer = async () => {
    if (!getIsWellFormedTitle(newOfficerName)) return;

    try {
      await officersApi.createOfficer({ churchId }, { name: newOfficerName });
      await dispatch(fetchOfficers());
      setNewOfficerName(BLANK);
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
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

  // 그룹 불러오기
  const fetchOfficer = () => {
    if (selectedOfficer.id) {
      const newOfficer = officers.find(
        (officer) => officer.id === selectedOfficer.id
      );
      if (newOfficer) {
        setSelectedOfficer(newOfficer);
      }
    }
  };

  useEffect(() => {
    if (
      officers &&
      selectedOfficer.id !== BLANK &&
      selectedOfficer.id !== null
    ) {
      fetchOfficer();
    }
  }, [officers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        onClickSaveNewOfficer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newOfficerName]);

  const props = {
    newOfficerName,
    isEditShown,
    isDeleteShown,
    editName,
    onClickDeleteOpen,
    onClickDeleteClose,
    onClickDelete,
    onChangeEditOfficerName,
    onClickEditOpen,
    onClickEditClose,
    onClickSaveEdit,
    onChangeNewOfficerName,
    onClickSaveNewOfficer,
    selectedOfficer,
    setSelectedOfficer,
    isToastShown,
    toastText,
    toastColor,
    setIsToastShown,
  };

  return (
    <>
      <OfficerManagementView {...props} />
    </>
  );
};

export default OfficerManagement;
