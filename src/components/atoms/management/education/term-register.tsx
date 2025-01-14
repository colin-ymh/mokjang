import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MembersApi } from '@/api/churches/members.api';
import { EducationTermsApi } from '@/api/management/education-terms.api';
import TermRegisterView from '@/components/atoms/management/education/term-register.view';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { Education, EducationTerm } from '@/models/management/management';
import { getIsWellFormedDate, getIsWellFormedTerm } from '@/utils/check';
import { getFormattedDate, getFormattedName } from '@/utils/format';

type TermRegisterProps = {
  education: Education;
  terms: EducationTerm[];
  onClickClose: () => void;
  fetchTerms: () => void;
};

const TermRegister = ({
  education,
  terms,
  onClickClose,
  fetchTerms,
}: TermRegisterProps) => {
  const membersApi = new MembersApi(false);
  const educationTermsApi = new EducationTermsApi(false);

  // 마지막 기수를 얻어내는 함수
  // const getLastTerm = (terms: EducationTerm[]) => {
  //   if (terms.length === 0) return '0'; // 빈 배열일 경우 null 반환
  //
  //   // endDate 기준으로 내림차순 정렬 후 첫 번째 항목 반환
  //   const sortedTerms = terms
  //     .filter((term) => term.endDate !== undefined)
  //     .sort(
  //       (a, b) =>
  //         new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime()
  //     );
  //
  //   return sortedTerms.length > 0 ? sortedTerms[0].term : '0';
  // };

  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 기수
  const [term, setTerm] = useState<string>(BLANK);
  // 교육 횟수
  const [session, setSession] = useState<string>(BLANK);
  // 교육 시작일
  const [startDate, setStartDate] = useState<string>(BLANK);
  // 교육 종료일
  const [endDate, setEndDate] = useState<string>(BLANK);
  // 교육 담당자 입력란
  const [instructorValue, setInstructorValue] = useState<string>(BLANK);
  // 검색된 교인목록
  const [searchedMembers, setSearchedMembers] = useState<DropdownValueType[]>(
    []
  );
  // 선택된 담당자 Id
  const [instructorId, setInstructorId] = useState<string>(BLANK);

  // 저장 가능 여부
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 기수 변경 이벤트
  const onChangeTerm = (event: ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능
    const newTerm = event.target.value.replace(/\D/g, ''); // 숫자 외 제거
    setTerm(newTerm);
  };

  // 교육 횟수 변경 이벤트
  const onChangeSession = (event: ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능
    const newSession = event.target.value.replace(/\D/g, ''); // 숫자 외 제거
    setSession(newSession);
  };

  // 교육 시작일 변경 이벤트
  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newStartDate = getFormattedDate(event.target.value);
    setStartDate(newStartDate);
  };

  // 교육 종료일 변경 이벤트
  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = getFormattedDate(event.target.value);
    setEndDate(newEndDate);
  };

  // 교육 담당자 검색창 변경 이벤트
  const onChangeInstructorValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getFormattedName(event.target.value);
    setInstructorValue(newValue);
  };

  // 담당자 선택 이벤트
  const onClickInstructor = (id: string) => {
    setInstructorId(id);
  };

  // 기수 저장 버튼 이벤트
  const onClickSave = () => {
    if (isSaveEnabled) {
      educationTermsApi
        .createEducationTerms(
          {
            churchId,
            educationId: education.id,
          },
          {
            startDate,
            endDate,
            term: parseInt(term),
            numberOfSessions: parseInt(session),
            instructorId: parseInt(instructorId),
          }
        )
        .then(() => {
          onClickClose();
          fetchTerms();
          clearData();
        });
    }
  };

  // 내용 초기화
  const clearData = () => {
    setTerm(term + 1);
    setSession(BLANK);
    setStartDate(BLANK);
    setEndDate(BLANK);
    setInstructorId(BLANK);
    setInstructorValue(BLANK);
  };

  // 검색 내용 변경 시, 교인 목록 불러오기
  useEffect(() => {
    if (instructorValue) {
      membersApi
        .getMembers({ churchId, page: 1, take: 5, name: instructorValue })
        .then((response) => {
          const newMembers: DropdownValueType[] = response.data.data.map(
            (member: Member) => {
              return {
                value: member.id,
                title: member.name,
              };
            }
          );

          setSearchedMembers(newMembers);
        });
    }
  }, [instructorValue]);

  // 내용 변경 시, 저장 가능 여부 변경
  useEffect(() => {
    if (term?.length === 0) return setIsSaveEnabled(false);
    if (!getIsWellFormedTerm(terms, term)) return setIsSaveEnabled(false);
    if (session?.length === 0) return setIsSaveEnabled(false);
    if (!getIsWellFormedDate(startDate)) return setIsSaveEnabled(false);
    if (!getIsWellFormedDate(endDate)) return setIsSaveEnabled(false);

    // 모든 조건을 통과하면 저장 가능
    setIsSaveEnabled(true);
  }, [term, session, startDate, endDate]);

  const props = {
    term,
    session,
    startDate,
    endDate,
    instructorValue,
    instructorId,
    isSaveEnabled,
    searchedMembers,
    onChangeTerm,
    onChangeSession,
    onChangeStartDate,
    onChangeEndDate,
    onChangeInstructorValue,
    onClickInstructor,
    onClickSave,
  };

  return (
    <>
      <TermRegisterView {...props} />
    </>
  );
};

export default TermRegister;
