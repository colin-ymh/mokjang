import MainWorshipHeaderView from '@/components/molecules/layout/header/main/worship/main-worship-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { WorshipsApi } from '@/api/worship/worships.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setWorships } from '@/redux/reducers/filter/worship-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { setTargetWorship } from '@/redux/reducers/target/target-worship-reducer';
import { DEFAULT_WORSHIP } from '@/models/worship/worship';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { BLANK } from '@/constants/constant';
import { DESTRUCTIVE } from '@/constants/styles/color';

type MainWorshipHeaderProps = {};

const MainWorshipHeader = ({}: MainWorshipHeaderProps) => {
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const worshipsApi = new WorshipsApi(false);

  const [isAddWorshipOpened, setIsAddWorshipOpened] = useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/worship/${id}`);
  };

  const onClickAddWorship = () => {
    setIsAddWorshipOpened(true);
  };

  const onClickCloseModal = () => {
    setIsAddWorshipOpened(false);
    dispatch(setTargetWorship(DEFAULT_WORSHIP));
  };

  const onClickSaveWorship = async () => {
    try {
      await worshipsApi
        .createWorship(
          { churchId },
          {
            title: targetWorship.title,
            description: targetWorship.description,
            worshipDay: targetWorship.worshipDay,
            repeatPeriod: targetWorship.repeatPeriod,
            worshipTargetGroupIds: targetWorship.worshipTargetGroupIds,
          }
        )
        .then((response) => {
          const newWorship = response.data.data;

          dispatch(setWorships([...worships, newWorship]));
          dispatch(setTargetWorship(DEFAULT_WORSHIP));
          setIsAddWorshipOpened(false);
        });
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetWorship.title)) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetWorship]);

  useEffect(() => {
    if (toastText) {
      setIsToastShown(true);
    }
  }, [toastText]);

  const props = {
    isAddWorshipOpened,
    isSaveEnabled,
    onClickHeaderBar,
    onClickAddWorship,
    onClickCloseModal,
    onClickSaveWorship,
  };

  return (
    <>
      <MainWorshipHeaderView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={DESTRUCTIVE.LIGHT}
        />
      )}
    </>
  );
};
export default MainWorshipHeader;
