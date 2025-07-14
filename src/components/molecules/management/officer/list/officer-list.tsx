import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Officer } from '@/models/management/management';
import OfficerListView from '@/components/molecules/management/officer/list/officer-list.view';
import { BLANK } from '@/constants/constant';
import { BLACK } from '@/constants/styles/color';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

type OfficerListProps = {
  selectedOfficerId: string | null;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
};

const OfficerList = ({
  selectedOfficerId,
  setSelectedOfficer,
}: OfficerListProps) => {
  const { officers } = useSelector((state: RootState) => state.church);

  // 토스트 팝업
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);

  // 닫혀있는 직분들
  const [closedOfficers, setClosedOfficers] = useState<Set<number>>(new Set());

  // 직분 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedOfficers((prevClosedOfficers) => {
      const newClosedOfficers = new Set(prevClosedOfficers);
      if (newClosedOfficers.has(ID)) {
        newClosedOfficers.delete(ID); // 이미 닫혀있으면 열기
      } else {
        newClosedOfficers.add(ID); // 닫힌 상태로 추가
      }
      return newClosedOfficers;
    });
  };

  // 직분 클릭 이벤트
  const onClickOfficer = async (officerId: string | null) => {
    if (!officerId) return;
    const newOfficer = officers.find((officer) => officer.id === officerId);
    if (newOfficer) {
      setSelectedOfficer(newOfficer);
    }
  };

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
      closedOfficers,
      selectedOfficerId,
      onClickOfficer,
      onClickToggle,
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
