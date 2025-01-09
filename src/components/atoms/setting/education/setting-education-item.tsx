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

import { DEFAULT_EDUCATION, Education } from '@/models/setting/setting';
import { EducationsApi } from '@/api/settings/educations.api';
import { getFormattedName } from '@/utils/format';
import { getIsWellFormedName } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import SettingEducationItemView from '@/components/atoms/setting/education/setting-education-item.view';

type SettingEducationItemProps = {
  education: Education;
  selectedEducationId: string | null;
  setSelectedEducation: Dispatch<SetStateAction<Education>>;
  fetchEducations: () => void;
};

const SettingEducationItem = ({
  education,
  selectedEducationId,
  setSelectedEducation,
  fetchEducations,
}: SettingEducationItemProps) => {
  const educationsApi = new EducationsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 새로 추가하는 그룹 입력창 ref
  const newEducationRef = useRef<HTMLInputElement>(null);

  // 새로 추가중인지 여부
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  // 새 그룹의 이름
  const [newEducationName, setNewEducationName] = useState<string>(BLANK);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(education.name);

  // 새그룹 이름 변경
  const onChangeNewEducationName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setNewEducationName(newName);
  };

  // 새로운 그룹 추가하기
  const onClickSaveNewEducation = () => {
    if (getIsWellFormedName(newEducationName)) {
      educationsApi
        .createEducation({ churchId }, { name: newEducationName })
        .then(() => {
          fetchEducations();
          setIsAddShown(false);
          setNewEducationName(BLANK);
        });
    }
  };

  // 확인 중인 그룹 변경
  const onClickEducation = (educationId: string | null) => {};

  // 그룹 수정 활성화
  const onClickEducationEdit = () => {
    setEditName(education.name);
    setIsEdit(true);

    // isEdit이 true로 전환된 이후
    setTimeout(() => {
      // 포커스
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    });
  };

  // 그룹 삭제
  const onClickEducationDelete = (educationId: string) => {
    educationsApi.deleteEducation({ churchId, educationId }).then(() => {
      fetchEducations();
      setSelectedEducation(DEFAULT_EDUCATION);
    });
  };

  // 그룹 추가 활성화
  const onClickEducationAdd = () => {
    setIsAddShown(true);
    setTimeout(() => {
      if (newEducationRef.current) {
        newEducationRef.current.focus();
      }
    });
  };

  // 이름 수정 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setEditName(newName);
  };

  // 수정된 이름 저장
  const onClickSaveName = () => {
    if (editName === education.name) {
      setIsEdit(false);
    } else if (getIsWellFormedName(editName)) {
      educationsApi
        .editEducation(
          { churchId, educationId: education.id as string },
          { name: editName }
        )
        .then((response) => {
          setSelectedEducation(response.data);
          fetchEducations();
          setIsEdit(false);
        });
    }
  };

  // 드래그 이후 드롭
  const onDropEducation = (
    educationId: string,
    parentEducationId: string | null
  ) => {};

  // 수정 중 focus 가 풀리면 수정 취소
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

  // 추가 중 focus 가 풀리면 추가 취소
  useEffect(() => {
    const inputElement = newEducationRef.current;

    const handleBlur = () => {
      setIsAddShown(false);
    };

    if (inputElement) {
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [newEducationRef, isAddShown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // !!!!!!!!!!!! 시발 !!!!!!!!!!!!
      // 한글 키보드로 입력 시, compose 를 하네;;;;;이 개같은거
      // isComposing 이 true => false 이 지랄을 하면서
      // 엔터가 두 번 입력되는 것 처럼 보였던 것이다
      // 이 개같은 것 때문에 시간을 존나 날려먹었다
      // !!!!!!!!!!!! 시발 !!!!!!!!!!!!
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        if (nameInputRef.current === document.activeElement) {
          if (getIsWellFormedName(editName)) {
            onClickSaveName();
          } else {
            setIsEdit(false);
          }
        } else if (newEducationRef.current === document.activeElement) {
          if (getIsWellFormedName(newEducationName)) {
            onClickSaveNewEducation();
          } else {
            setIsAddShown(false);
          }
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        } else if (newEducationRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editName, newEducationName, onClickSaveName, onClickSaveNewEducation]);

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
    onClickEducationAdd,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <SettingEducationItemView {...props} />
    </>
  );
};

export default SettingEducationItem;
