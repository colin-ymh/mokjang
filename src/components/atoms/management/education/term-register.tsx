import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
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
  setIsToastShown?: Dispatch<SetStateAction<boolean>>;
};

const TermRegister = ({
  education,
  terms,
  onClickClose,
  fetchTerms,
  targetTerm,
  setIsToastShown,
}: TermRegisterProps) => {
  const membersApi = new MembersApi(false);
  const educationTermsApi = new EducationTermsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [term, setTerm] = useState<string>(targetTerm?.term || BLANK);
  const [session, setSession] = useState<string>(
    targetTerm?.numberOfSessions || BLANK
  );
  const [startDate, setStartDate] = useState<string>(
    targetTerm?.startDate ? getFormattedDate(targetTerm.startDate) : BLANK
  );
  const [endDate, setEndDate] = useState<string>(
    targetTerm?.endDate ? getFormattedDate(targetTerm.endDate) : BLANK
  );
  const [instructorValue, setInstructorValue] = useState<string>(
    targetTerm?.instructor?.name || BLANK
  );
  const [searchedMembers, setSearchedMembers] = useState<
    MemberDropdownValueType[]
  >([]);
  const [instructorId, setInstructorId] = useState<string>(
    targetTerm?.instructorId || BLANK
  );
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const onChangeTerm = (event: ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value.replace(/\D/g, ''));
  };

  const onChangeSession = (event: ChangeEvent<HTMLInputElement>) => {
    setSession(event.target.value.replace(/\D/g, ''));
  };

  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(getFormattedDate(event.target.value));
  };

  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(getFormattedDate(event.target.value));
  };

  const onChangeInstructorValue = (event: ChangeEvent<HTMLInputElement>) => {
    setInstructorValue(getFormattedName(event.target.value));
  };

  const onClickInstructor = (instructorId: string) => {
    setInstructorId(instructorId);
    const newValue = searchedMembers.find(
      (member) => member.value === instructorId
    );
    if (newValue) {
      setInstructorValue(newValue.title);
    }
  };

  const onClickSave = async () => {
    if (!isSaveEnabled) return;

    try {
      if (targetTerm?.id) {
        await educationTermsApi.editEducationTerms(
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
        );
      } else {
        await educationTermsApi.createEducationTerms(
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
        );
      }
      onClickClose();
      fetchTerms();
      clearData();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown && setIsToastShown(true);
    }
  };

  const clearData = () => {
    setTerm(term + 1);
    setSession(BLANK);
    setStartDate(BLANK);
    setEndDate(BLANK);
    setInstructorId(BLANK);
    setInstructorValue(BLANK);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      if (!instructorValue) return;

      try {
        const response = await membersApi.getMembers({
          churchId,
          page: 1,
          take: 5,
          name: instructorValue,
        });

        setSearchedMembers(
          response.data.data.map((member: Member) => ({
            value: member.id,
            title: member.name,
            profileImage: member?.profileImage,
            age: member?.birth && getAge(getDateFromString(member.birth)),
          }))
        );
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchMembers();
  }, [instructorValue]);

  useEffect(() => {
    if (!term || !getIsWellFormedTerm(terms, term)) {
      setIsSaveEnabled(false);
      return;
    }
    if (
      !session ||
      !getIsWellFormedDate(startDate) ||
      !getIsWellFormedDate(endDate)
    ) {
      setIsSaveEnabled(false);
      return;
    }

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
