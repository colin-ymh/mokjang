import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import OfficerListView from '@/components/molecules/management/officer/list/officer-list.view';
import { BLANK } from '@/constants/constant';
import { BLACK } from '@/constants/styles/color';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

type OfficerListProps = {
  selectedOfficerId: string;
  onClickOfficer: (id: string) => void;
};

const OfficerList = ({
  selectedOfficerId,
  onClickOfficer,
}: OfficerListProps) => {
  const { officers } = useSelector((state: RootState) => state.church);

  // 토스트 팝업
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);

  const props = {
    list: {
      officers,
    },
    toast: {
      setIsToastShown,
      setToastText,
      setToastColor,
    },
    item: {
      selectedOfficerId,
      onClickOfficer,
    },
  };

  return (
    <>
      <OfficerListView {...props} />

      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={toastColor}
        />
      )}
    </>
  );
};

export default OfficerList;
