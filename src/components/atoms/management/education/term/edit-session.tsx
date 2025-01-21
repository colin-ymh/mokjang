import { ChangeEvent, useState } from 'react';

import { EducationSession } from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import EditSessionView from '@/components/atoms/management/education/term/edit-session.view';
import { getFormattedDate } from '@/utils/format';
import { EducationSessionsApi } from '@/api/management/education/education-sessions.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type EditSessionProps = {
  targetSession: EducationSession;
  educationId: string;
  onClickClose: () => void;
  fetchTerms: () => void;
};

const EditSession = ({
  targetSession,
  educationId,
  onClickClose,
  fetchTerms,
}: EditSessionProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationSessionsApi = new EducationSessionsApi(false);
  const [sessionDate, setSessionDate] = useState<string>(BLANK);
  const [sessionContent, setSessionContent] = useState<string>(
    targetSession.content
  );

  const onChangeSessionDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = getFormattedDate(event.target.value);
    if (newDate) {
      setSessionDate(newDate);
    }
  };

  const onChangeSessionContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setSessionContent(event.target.value);
  };

  const onClickSave = () => {
    educationSessionsApi
      .editEducationSessions(
        {
          churchId,
          educationId,
          educationTermId: targetSession.educationTermId,
          educationSessionId: targetSession.id,
        },
        {
          content: sessionContent,
        }
      )
      .then(() => {
        onClickClose();
        fetchTerms();
      });
  };

  const props = {
    sessionDate,
    sessionContent,
    onChangeSessionDate,
    onChangeSessionContent,
    onClickSave,
  };
  return (
    <>
      <EditSessionView {...props} />
    </>
  );
};

export default EditSession;
