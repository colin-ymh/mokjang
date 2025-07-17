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
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

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
        });
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
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
    onClickHeaderBar,
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
