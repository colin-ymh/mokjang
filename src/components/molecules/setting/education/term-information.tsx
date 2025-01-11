import TermInformationView from '@/components/molecules/setting/education/term-information.view';
import { Education, EducationTerm } from '@/models/setting/setting';
import { useState } from 'react';

type TermInformationProps = {
  education: Education;
  term: EducationTerm;
};

const TermInformation = ({ education, term }: TermInformationProps) => {
  // 선택된 회차
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    term?.educationSessions[0]?.session?.toString()
  );

  // 회차 선택
  const onClickHeaderItem = (id: string) => {
    setSelectedSessionId(id);
  };

  const props = {
    header: {
      education,
      term,
      selectedSessionId,
      onClickHeaderItem,
    },
  };

  return (
    <>
      <TermInformationView {...props} />
    </>
  );
};

export default TermInformation;
