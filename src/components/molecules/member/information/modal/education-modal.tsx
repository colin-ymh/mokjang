import { useState } from 'react';

import EducationModalView from '@/components/molecules/member/information/modal/education-modal.view';
import { BLANK, NULL } from '@/constants/constant';
import { useEducationDropdownItems } from '@/hooks/dropdown/dropdown-items';

type EducationModalProps = {
  prevEducationId: string;
  onClickClose: () => void;
};

const EducationModal = ({
  prevEducationId,
  onClickClose,
}: EducationModalProps) => {
  const isEdit = prevEducationId !== undefined;
  const educationItems = useEducationDropdownItems().filter(
    (item) => item.value !== NULL
  );
  const [educationId, setEducationId] = useState<string>(
    prevEducationId || educationItems[0].value
  );

  const onChangeEducation = (id: string) => {
    setEducationId(id);
  };

  const props = {
    isEdit,
    educationId,
    educationItems,
    onClickClose,
    onChangeEducation,
  };

  return (
    <>
      <EducationModalView {...props} />
    </>
  );
};

export default EducationModal;
