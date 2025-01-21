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
import { getIsWellFormedName } from '@/utils/check';
import ManagementEducationItemView from '@/components/atoms/management/education/management-education-item.view';

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
  const educationsApi = new EducationsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(education.name);

  // 확인 중인 교육 변경
  const onClickEducation = (education: Education) => {
    setSelectedEducation(education);
  };

  // 교육 수정 활성화
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

  // 교육 삭제
  const onClickEducationDelete = (educationId: string) => {
    educationsApi.deleteEducation({ churchId, educationId }).then(() => {
      fetchEducations();
      setSelectedEducation(DEFAULT_EDUCATION);
    });
  };

  // 이름 수정 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
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
    </>
  );
};

export default ManagementEducationItem;
