import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { DEFAULT_EDUCATION, Education } from '@/models/management/management';
import { EducationsApi } from '@/api/management/education/educations.api';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import ManagementEducationItemView from '@/components/atoms/management/education/management-education-item.view';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

import { useScopedI18n } from '../../../../../locales/client';

type ManagementEducationItemProps = {
  education: Education;
  selectedEducationId: string | null;
  setSelectedEducation: Dispatch<SetStateAction<Education>>;
  fetchEducations: () => void;
};

const ManagementEducationItem = ({
  education,
  selectedEducationId,
  setSelectedEducation,
  fetchEducations,
}: ManagementEducationItemProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  const educationsApi = new EducationsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(education.name);

  const onClickEducation = (education: Education) => {
    setSelectedEducation(education);
  };

  const onClickEducationEdit = () => {
    setEditName(education.name);
    setIsEdit(true);
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    });
  };

  const onClickEducationDelete = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmDelete = async (educationId: string) => {
    try {
      await educationsApi.deleteEducation({ churchId, educationId });
      fetchEducations();
      setSelectedEducation(DEFAULT_EDUCATION);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsPopupShown(false);
    }
  };

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onClickSaveName = async () => {
    if (editName === education.name) {
      setIsEdit(false);
      return;
    }

    if (getIsWellFormedTitle(editName)) {
      try {
        const response = await educationsApi.editEducation(
          { churchId, educationId: education.id as string },
          { name: editName }
        );
        setSelectedEducation(response.data);
        fetchEducations();
        setIsEdit(false);
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  };

  const onDropEducation = (
    educationId: string,
    parentEducationId: string | null
  ) => {};

  useEffect(() => {
    const inputElement = nameInputRef.current;

    const handleBlur = () => {
      setIsEdit(false);
    };

    if (inputElement) {
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [nameInputRef, isEdit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        if (nameInputRef.current === document.activeElement) {
          if (getIsWellFormedTitle(editName)) {
            onClickSaveName();
          } else {
            setIsEdit(false);
          }
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editName, onClickSaveName]);

  const props = {
    isEdit,
    nameInputRef,
    selectedEducationId,
    education,
    editName,
    onDropEducation,
    onClickEducation,
    onClickEducationEdit,
    onClickEducationDelete,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <ManagementEducationItemView {...props} />
      <ConfirmPopup
        title={t_popup('deleteEducationTitle')}
        body={t_popup('deleteEducationBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={() => onClickConfirmDelete(education.id as string)}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </>
  );
};

export default ManagementEducationItem;
