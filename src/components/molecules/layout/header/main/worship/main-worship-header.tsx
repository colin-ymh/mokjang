import MainWorshipHeaderView from '@/components/molecules/layout/header/main/worship/main-worship-header.view';
import { useEffect, useState } from 'react';
import { WorshipsApi } from '@/api/worship/worships.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setWorships } from '@/redux/reducers/filter/worship-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { setTargetWorship } from '@/redux/reducers/target/target-worship-reducer';
import { DEFAULT_WORSHIP } from '@/models/worship/worship';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { useI18n } from '../../../../../../../locales/client';

type MainWorshipHeaderProps = {};

const MainWorshipHeader = ({}: MainWorshipHeaderProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { worships } = useSelector((state: RootState) => state.worshipFilter);

  const worshipsApi = new WorshipsApi(false);

  const [isAddWorshipOpened, setIsAddWorshipOpened] = useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickAddWorship = () => {
    setIsAddWorshipOpened(true);
    dispatch(setTargetWorship({ ...DEFAULT_WORSHIP, id: 'TEMP' }));
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

          dispatch(setToastText(t('popup.saveComplete')));
          dispatch(setToastBackgroundColor(BLACK));
          dispatch(setIsToastShown(true));
        });
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
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

  const props = {
    isAddWorshipOpened,
    isSaveEnabled,
    onClickAddWorship,
    onClickCloseModal,
    onClickSaveWorship,
  };

  return (
    <>
      <MainWorshipHeaderView {...props} />
    </>
  );
};
export default MainWorshipHeader;
