import { ChangeEvent, useState } from 'react';
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
};

const EditSession = ({
  targetSession,
  educationId,
  onClickClose,
  fetchTerms,
}: EditSessionProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationSessionsApi = new EducationSessionsApi(false);
  const [sessionDate, setSessionDate] = useState<string>(
    targetSession.sessionDate
      ? getFormattedDate(targetSession.sessionDate)
      : BLANK
  );
  const [sessionContent, setSessionContent] = useState<string>(
    targetSession.content
  );

  const onChangeSessionDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = getFormattedDate(event.target.value);

    setSessionDate(newDate);
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
          sessionDate,
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
