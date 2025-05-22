import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { EducationsApi } from '@/api/education/educations.api';
import { usePageRouter } from '@/utils/router';
import RegisterEducationView from '@/components/organisms/church/register-education.view';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { DEFAULT_EDUCATION, Education } from '@/models/education/education';

type EducationListProps = {};

const RegisterEducation = ({}: EducationListProps) => {
  const educationsApi = new EducationsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const router = usePageRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 선택된 교육
  const [selectedEducation, setSelectedEducation] =
    useState<Education>(DEFAULT_EDUCATION);

  // 전체 교육 배열
  const [educations, setEducations] = useState<Education[]>([]);

  // 새로운 교육 이름
  const [newEducationName, setNewEducationName] = useState<string>(BLANK);

  // 이름 변경
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    setNewEducationName(newName);
  };

  // 새로운 교육 저장
  const onClickSaveEducation = async () => {
    try {
      if (getIsWellFormedTitle(newEducationName)) {
        await educationsApi.createEducation(
          { churchId },
          { name: newEducationName }
        );
        fetchEducations();
        setNewEducationName(BLANK);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 교육 불러오기
  const fetchEducations = async () => {
    try {
      const response = await educationsApi.getEducations({ churchId });
      if (response.status === 200) {
        const newEducations = response.data.data;
        setEducations(newEducations);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 다음 설정으로 이동
  const onClickSave = () => {
    router.replace('');
  };

  useEffect(() => {
    if (churchId) {
      fetchEducations();
    }
  }, [churchId]);

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
        if (getIsWellFormedTitle(newEducationName)) {
          onClickSaveEducation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [newEducationName]);

  const props = {
    educations,
    selectedEducationId: selectedEducation.id,
    setSelectedEducation,
    fetchEducations,
    nameInputRef,
    newEducationName,
    onChangeName,
    onClickSaveEducation,
    onClickSave,
  };
  return (
    <>
      <RegisterEducationView {...props} />
    </>
  );
};

export default RegisterEducation;
