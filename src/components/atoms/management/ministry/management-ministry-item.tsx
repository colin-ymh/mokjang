import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedName } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import { Ministry } from '@/models/management/management';
import ManagementMinistryItemView from '@/components/atoms/management/ministry/management-ministry-item.view';

type ManagementMinistryItemProps = {
  ministry: Ministry;
  ministries: Ministry[];
  selectedMinistryId: string | null;
  setMinistries: Dispatch<SetStateAction<Ministry[]>>;
  setSelectedMinistry: Dispatch<SetStateAction<Ministry>>;
};

const ManagementMinistryItem = ({
  ministry,
  ministries,
  selectedMinistryId,
  setMinistries,
  setSelectedMinistry,
}: ManagementMinistryItemProps) => {
  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 새로 추가하는 그룹 입력창 ref
  const newMinistryRef = useRef<HTMLInputElement>(null);

  // 새로 추가중인지 여부
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  // 새 그룹의 이름
  const [newMinistryName, setNewMinistryName] = useState<string>(BLANK);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(ministry.name);

  // 새로운 그룹 추가하기
  const onClickSaveNewMinistry = () => {
    if (getIsWellFormedName(newMinistryName)) {
      setMinistries([
        ...ministries,
        {
          name: newMinistryName,
          // 나머지는 다 임시 추가
          id: new Date().getTime().toString(),
          churchId: new Date().getTime().toString(),
          ministryGroupId: new Date().getTime().toString(),
          membersCount: 0,
        },
      ]);
    }
  };

  // 확인 중인 그룹 변경
  const onClickMinistry = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
  };

  // 그룹 수정 활성화
  const onClickMinistryEdit = () => {
    setEditName(ministry.name);
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
  const onClickMinistryDelete = (ministryId: string) => {
    const newMinistrys = ministries.filter(
      (ministry) => ministry.id !== ministryId
    );
    setMinistries(newMinistrys);
  };

  // 그룹 추가 활성화
  const onClickMinistryAdd = () => {
    setIsAddShown(true);
    setTimeout(() => {
      if (newMinistryRef.current) {
        newMinistryRef.current.focus();
      }
    });
  };

  // 이름 수정 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    setEditName(newName);
  };

  // 수정된 이름 저장
  const onClickSaveName = () => {
    if (editName === ministry.name) {
      setIsEdit(false);
    } else if (getIsWellFormedName(editName)) {
      const newMinistrys = ministries.map((ministry) => {
        return ministry.id !== selectedMinistryId
          ? ministry
          : {
              ...ministry,
              ministry: editName,
            };
      });
      setMinistries(newMinistrys);
      setIsEdit(false);
    }
  };

  // 드래그 이후 드롭
  const onDropMinistry = (
    ministryId: string,
    parentMinistryId: string | null
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
    const inputElement = newMinistryRef.current;

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
  }, [newMinistryRef, isAddShown]);

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
        } else if (newMinistryRef.current === document.activeElement) {
          if (getIsWellFormedName(newMinistryName)) {
            onClickSaveNewMinistry();
          } else {
            setIsAddShown(false);
          }
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        } else if (newMinistryRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editName, newMinistryName, onClickSaveName, onClickSaveNewMinistry]);

  const props = {
    isEdit,
    nameInputRef,
    selectedMinistryId,
    ministry,
    editName,
    onDropMinistry,
    onClickMinistry,
    onClickMinistryEdit,
    onClickMinistryDelete,
    onClickMinistryAdd,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <ManagementMinistryItemView {...props} />
    </>
  );
};

export default ManagementMinistryItem;
