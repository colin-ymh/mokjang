import { useState } from 'react';
import MemberEducationView from '@/components/molecules/member/information/member-education.view';
import { BLANK } from '@/constants/constant';

const MemberEducation = () => {
  // 교육 추가 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 교육 추가 모달 활성화
  const onClickOpenModal = () => {
    setIsModalShown(true);
  };

  // 모달 닫기
  const onClickCloseModal = () => {
    setIsModalShown(false);
  };

  // 수정하려는 교육
  const [targetEducationId, setTargetEducationId] = useState<string>(BLANK);

  const props = {
    targetEducationId,
    isModalShown,
    onClickOpenModal,
    onClickCloseModal,
  };

  return (
    <>
      <MemberEducationView {...props} />
    </>
  );
};

export default MemberEducation;
