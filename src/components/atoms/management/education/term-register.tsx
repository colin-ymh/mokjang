import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MembersApi } from '@/api/members/members.api';
import { EducationTermsApi } from '@/api/management/education/education-terms.api';
import TermRegisterView from '@/components/atoms/management/education/term-register.view';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { Education, EducationTerm } from '@/models/management/management';
import { getIsWellFormedDate, getIsWellFormedTerm } from '@/utils/check';
import { getFormattedDate, getFormattedName } from '@/utils/format';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import { getAge, getDateFromString } from '@/utils/date';

type TermRegisterProps = {
  education: Education;
  terms: EducationTerm[];
  onClickClose: () => void;
  fetchTerms: () => void;
  targetTerm?: EducationTerm;
};

const TermRegister = ({
  education,
  terms,
  onClickClose,
  fetchTerms,
  targetTerm,
}: TermRegisterProps) => {
  const membersApi = new MembersApi(false);
  const educationTermsApi = new EducationTermsApi(false);

  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 기수
  const [term, setTerm] = useState<string>(targetTerm?.term || BLANK);
  // 교육 횟수
  const [session, setSession] = useState<string>(
    targetTerm?.numberOfSessions || BLANK
  );
  // 교육 시작일
  const [startDate, setStartDate] = useState<string>(
    targetTerm?.startDate ? getFormattedDate(targetTerm.startDate) : BLANK
  );
  // 교육 종료일
  const [endDate, setEndDate] = useState<string>(
    targetTerm?.endDate ? getFormattedDate(targetTerm.endDate) : BLANK
  );
  // 교육 담당자 입력란
  const [instructorValue, setInstructorValue] = useState<string>(
    targetTerm?.instructor?.name || BLANK
  );
  // 검색된 교인목록
  const [searchedMembers, setSearchedMembers] = useState<
    MemberDropdownValueType[]
  >([]);
  // 선택된 담당자 Id
  const [instructorId, setInstructorId] = useState<string>(
    targetTerm?.instructorId || BLANK
  );

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
  const onClickInstructor = (instructorId: string) => {
    setInstructorId(instructorId);
    const newValue = searchedMembers.find(
      (member) => member.value === instructorId
    );
    if (newValue) {
      setInstructorValue(newValue.title);
    }
  };

  // 기수 저장 버튼 이벤트
  const onClickSave = () => {
    if (isSaveEnabled) {
      if (targetTerm?.id) {
        educationTermsApi
          .editEducationTerms(
            {
              churchId,
              educationId: education.id,
              educationTermId: targetTerm.id,
            },
            {
              startDate,
              endDate,
              term: targetTerm.term !== term ? parseInt(term) : undefined,
              numberOfSessions: parseInt(session),
              instructorId: instructorId ? parseInt(instructorId) : undefined,
            }
          )
          .then(() => {
            onClickClose();
            fetchTerms();
            clearData();
          });
      } else {
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
              instructorId: instructorId ? parseInt(instructorId) : undefined,
            }
          )
          .then(() => {
            onClickClose();
            fetchTerms();
            clearData();
          });
      }
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
          const newMembers: MemberDropdownValueType[] = response.data.data.map(
            (member: Member) => {
              return {
                value: member.id,
                title: member.name,
                profileImage: member?.profileImage,
                age: member?.birth && getAge(getDateFromString(member.birth)),
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
