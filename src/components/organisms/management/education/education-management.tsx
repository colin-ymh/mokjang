import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { EducationsApi } from '@/api/management/education/educations.api';
import { EDUCATION_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import EducationManagementView from '@/components/organisms/management/education/education-management.view';
import { DEFAULT_EDUCATION, Education } from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedName } from '@/utils/check';
import { useEducationManagementHeaderBarItems } from '@/hooks/layout/header-bar-items';

type EducationManagementProps = {};

const EducationManagement = ({}: EducationManagementProps) => {
  const educationsApi = new EducationsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 교육 설정 탭 헤더
  const headerBarItems = useEducationManagementHeaderBarItems();

  // 선택된 교육
  const [selectedEducation, setSelectedEducation] =
    useState<Education>(DEFAULT_EDUCATION);

  // 선택된 교육 정보 탭
  const [headerBarId, setHeaderBarId] =
    useState<EDUCATION_MANAGEMENT_HEADER_ID>(
      EDUCATION_MANAGEMENT_HEADER_ID.TERM
    );

  // 전체 교육 배열
  const [educations, setEducations] = useState<Education[]>([]);

  // 새로운 교육 추가 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

  // 새로운 교육 이름
  const [newEducationName, setNewEducationName] = useState<string>(BLANK);

  // 교육 추가 모달 열기
  const onClickModalOpen = () => {
    setIsAddModalShown(true);

    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    });
  };

  // 이름 변경
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    setNewEducationName(newName);
  };

  // 새로운 교육 저장
  const onClickSaveEducation = () => {
    if (getIsWellFormedName(newEducationName)) {
      educationsApi
        .createEducation({ churchId }, { name: newEducationName })
        .then(() => {
          fetchEducations();
          setIsAddModalShown(false);
          setNewEducationName(BLANK);
        });
    }
  };

  // 교육 불러오기
  const fetchEducations = () => {
    educationsApi.getEducations({ churchId }).then((response) => {
      if (response.status === 200) {
        const newEducations = response.data;
        setEducations(newEducations);
      }
    });
  };

  // 새로운 탭 이벤트
  const onClickHeaderBar = (id: EDUCATION_MANAGEMENT_HEADER_ID) => {
    setHeaderBarId(id);
  };

  // 교회 정보를 통해 교육들 불러오기
  useEffect(() => {
    if (churchId) {
      fetchEducations();
    }
  }, [churchId]);

  // 수정 중 focus 가 풀리면 수정 취소
  useEffect(() => {
    const inputElement = nameInputRef.current;

    const handleBlur = () => {
      setIsAddModalShown(false);
    };

    if (inputElement) {
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [nameInputRef]);

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
        if (getIsWellFormedName(newEducationName)) {
          onClickSaveEducation();
        } else {
          setIsAddModalShown(false);
        }
      } else if (e.key === 'Escape') {
        setIsAddModalShown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [newEducationName]);

  const props = {
    educations,
    fetchEducations,
    selectedEducation,
    setSelectedEducation,
    headerBarId,
    headerBarItems,
    isAddModalShown,
    nameInputRef,
    newEducationName,
    onClickModalOpen,
    onChangeName,
    onClickSaveEducation,
    onClickHeaderBar,
  };

  return (
    <>
      <EducationManagementView {...props} />
    </>
  );
};

export default EducationManagement;
