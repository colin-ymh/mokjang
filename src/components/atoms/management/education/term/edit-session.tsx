import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { EducationSessionsApi } from '@/api/management/education/education-sessions.api';
import { BLANK } from '@/constants/constant';
import EditSessionView from '@/components/atoms/management/education/term/edit-session.view';
import { EducationSession } from '@/models/management/management';
import { getFormattedDate } from '@/utils/format';

type EditSessionProps = {
  targetSession: EducationSession;
  educationId: string;
  onClickClose: () => void;
  fetchTerms: () => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const EditSession = ({
  targetSession,
  educationId,
  onClickClose,
  fetchTerms,
  setIsToastShown,
}: EditSessionProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationSessionsApi = new EducationSessionsApi(false);
  const [sessionDate, setSessionDate] = useState<string>(
    targetSession.sessionDate
      ? getFormattedDate(targetSession.sessionDate)
      : BLANK
  );
  const [isSessionDone, setIsSessionDone] = useState<boolean>(
    targetSession.isDone
  );
  const [sessionContent, setSessionContent] = useState<string>(
    targetSession.content
  );
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeSessionDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = getFormattedDate(event.target.value);
    setSessionDate(newDate);
  };

  const onChangeSessionDone = (isDone: boolean) => {
    setIsSessionDone(isDone);
  };

  const onChangeSessionContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSessionContent(event.target.value);
  };

  const onClickSave = async () => {
    try {
      await educationSessionsApi.editEducationSessions(
        {
          churchId,
          educationId,
          educationTermId: targetSession.educationTermId,
          educationSessionId: targetSession.id,
        },
        {
          sessionDate: sessionDate || undefined,
          content: sessionContent || undefined,
          isDone: isSessionDone || undefined,
        }
      );
      onClickClose();
      fetchTerms();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  const props = {
    sessionDate,
    isSessionDone,
    sessionContent,
    onChangeSessionDate,
    onChangeSessionDone,
    onChangeSessionContent,
    onClickSave,
  };

  return <EditSessionView {...props} />;
};

export default EditSession;
