import BaptismModalView from '@/components/atoms/common/modal/baptism-modal.view';
import { BAPTISM } from '@/constants/constant';
import { useState } from 'react';

type BaptismModalProps = {
  targetBaptism?: BAPTISM;
  onClickSave: (baptism: BAPTISM) => void;
};

const BaptismModal = ({ targetBaptism, onClickSave }: BaptismModalProps) => {
  const [selectedBaptism, setSelectedBaptism] = useState<BAPTISM>(
    targetBaptism || BAPTISM.NONE
  );

  const onClickItem = (newBaptism: BAPTISM) => {
    setSelectedBaptism(newBaptism);
  };

  const props = {
    selectedBaptism,
    onClickItem,
    onClickSave,
  };

  return (
    <>
      <BaptismModalView {...props} />
    </>
  );
};

export default BaptismModal;
