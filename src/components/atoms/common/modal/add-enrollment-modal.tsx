import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MembersApi } from '@/api/churches/members.api';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import {
  EducationEnrollment,
  EducationTerm,
} from '@/models/management/management';
import { getFormattedName } from '@/utils/format';
import { EducationEnrollmentsApi } from '@/api/management/education/education-enrollments.api';
import AddEnrollmentModalView from '@/components/atoms/common/modal/add-enrollment-modal.view';

type AddEnrollmentModalProps = {
  term: EducationTerm;
  enrollments: EducationEnrollment[];
  isShown: boolean;
  onClickClose: () => void;
  fetchTerms: () => void;
};

const AddEnrollmentModal = ({
  term,
  enrollments,
  isShown,
  onClickClose,
  fetchTerms,
}: AddEnrollmentModalProps) => {
  const membersApi = new MembersApi(false);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 검색하고자 하는 교인 이름
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 데이터 리셋
  const resetData = () => {
    setSearchName(BLANK);
    setSelectedMembers([]);
  };

  // 검색창 이벤트
  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const name = getFormattedName(event.target.value);
    setSearchName(name);
  };

  // 교인 선택
  const onClickMember = (targetMember: Member) => {
    // 이미 존재하는지 확인
    const isMemberSelected = selectedMembers.some(
      (member) => member.id === targetMember.id
    );

    // 이미 존재한다면 제거, 없으면 추가
    const newSelectedMembers = isMemberSelected
      ? selectedMembers.filter((member) => member.id !== targetMember.id)
      : [...selectedMembers, targetMember];

    setSelectedMembers(newSelectedMembers);
  };

  // 추가 버튼 이벤트
  const onClickSave = async () => {
    if (selectedMembers.length !== 0) {
      try {
        // 모든 비동기 API 호출을 Promise.all로 처리
        await Promise.all(
          selectedMembers.map((member) =>
            educationEnrollmentsApi.createEducationEnrollments(
              {
                churchId,
                educationId: term.educationId,
                educationTermId: term.id,
              },
              { memberId: member.id }
            )
          )
        );

        // 모든 API 호출이 완료된 후 실행
        fetchTerms();
        onClickClose();
        resetData();
      } catch (error) {
        console.error('Error creating enrollments:', error);
      }
    }
  };

  // 검색 내용이 변경되면, 검색된 교인 목록 변경
  useEffect(() => {
    membersApi
      .getMembers({ churchId, page: 1, take: 1000, name: searchName })
      .then((response) => {
        const newMembers = response.data.data;
        setSearchedMembers(newMembers);
      });
  }, [searchName, isShown]);

  // esc
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickClose();
        resetData();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClickClose]);

  const props = {
    enrollments,
    isShown,
    searchName,
    searchedMembers,
    selectedMembers,
    resetData,
    onChangeSearch,
    onClickMember,
    onClickClose,
    onClickSave,
  };
  return (
    <>
      <AddEnrollmentModalView {...props} />
    </>
  );
};

export default AddEnrollmentModal;
