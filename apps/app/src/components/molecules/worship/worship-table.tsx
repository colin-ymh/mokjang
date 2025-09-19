import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchWorships,
  setWorshipOrderBy,
  setWorshipOrderDirection,
  setWorshipPage,
  setWorships,
} from '../../../redux/reducers/filter/worship-filter-reducer';

import { BLACK, DESTRUCTIVE, MAIN, ORDER_DIRECTION, WORSHIP, } from '@mokjang/constants';
import { WorshipsApi } from '../../../api/worship/worships.api';
import { DEFAULT_WORSHIP, Worship } from '@mokjang/models';
import { setTargetWorship } from '../../../redux/reducers/target/target-worship-reducer';
import { getIsWellFormedTitle, usePageRouter } from '@mokjang/utils';
import WorshipTableView from './worship-table.view';
import { setIsToastShown, setToastBackgroundColor, setToastText, } from '../../../redux/reducers/toast-popup-reducer';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { CustomPopup } from '@mokjang/components';
import AddWorship from '@/components/organisms/worship/add/add-worship';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

export type WorshipTableProps = {
  loadWorships: () => Promise<void>;
};

const WorshipTable = ({ loadWorships }: WorshipTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');

  const router = usePageRouter();

  const { churchId } = useSelector((state: RootState) => state.church);
  const { worships, worshipFilter, worshipOrderBy, worshipOrderDirection } =
    useSelector((state: RootState) => state.worshipFilter);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const worshipsApi = new WorshipsApi(false);

  const [isEditModalOpened, setIsEditModalOpened] = useState<boolean>(false);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickWorshipItem = async (worship: Worship) => {
    try {
      const worshipsApi = new WorshipsApi(false);

      const response = await worshipsApi.getWorship({
        churchId,
        worshipId: worship.id,
      });

      const newWorship = response.data.data;

      dispatch(setTargetWorship(newWorship));

      router.push(`main/attendance`);
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

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: WORSHIP) => {
    let newOrderBy = id;

    if (newOrderBy !== worshipOrderBy) {
      dispatch(setWorshipOrderBy(newOrderBy));
      dispatch(setWorshipOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setWorshipOrderDirection(
          worshipOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC
        )
      );
    }
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadWorships(); // 데이터를 추가로 로드
      }
    }
  };

  const onClickEditWorship = (worship: Worship) => {
    setIsEditModalOpened(true);
    dispatch(setTargetWorship(worship));
  };

  const onClickEditDone = async () => {
    try {
      const prevWorship = worships.find(
        (worship) => worship.id === targetWorship.id
      );

      if (prevWorship) {
        await worshipsApi
          .editWorship(
            { churchId, worshipId: targetWorship.id },
            {
              title:
                prevWorship.title !== targetWorship.title
                  ? targetWorship.title
                  : undefined,
              description: targetWorship.description,
              worshipDay: targetWorship.worshipDay,
              repeatPeriod: targetWorship.repeatPeriod,
              worshipTargetGroupIds: targetWorship.worshipTargetGroupIds,
            }
          )
          .then((response) => {
            const newWorship = response.data.data;

            const newWorships = worships.map((worship: Worship) => {
              if (worship.id === newWorship.id) {
                return newWorship;
              } else {
                return worship;
              }
            });

            dispatch(setWorships(newWorships));
            dispatch(setTargetWorship(DEFAULT_WORSHIP));
            setIsEditModalOpened(false);

            dispatch(setToastText(t('popup.saveComplete')));
            dispatch(setToastBackgroundColor(BLACK));
            dispatch(setIsToastShown(true));
          });
      }
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

  // 수정 페이지 종료
  const onClickEditClose = () => {
    setIsEditModalOpened(false);
    dispatch(setTargetWorship(DEFAULT_WORSHIP));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      await worshipsApi.deleteWorship({
        churchId,
        worshipId: targetWorship.id,
      });

      // 초기화 후 다시 로드
      dispatch(setWorshipPage(1));
      // 삭제 후 재로딩
      await dispatch(fetchWorships());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetWorship(DEFAULT_WORSHIP));
      setIsEditModalOpened(false);
    }
  };

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [worshipOrderBy, worshipOrderDirection, worshipFilter]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetWorship.title)) {
      setIsEditEnabled(false);
      return;
    }

    setIsEditEnabled(true);
  }, [targetWorship]);

  const props = {
    scrollRef,
    worships,
    isEditModalOpened,
    isEditEnabled,
    onClickHeader,
    onScroll,
    onClickEditWorship,
    onClickEditDone,
    onClickEditClose,
    onClickWorshipItem,
  };

  return (
    <>
      <WorshipTableView {...props} />
      <CustomPopup
        isShow={isEditModalOpened}
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        headerTitle={t_title('editWorship')}
        width={500}
        height={500}
        onClickDone={onClickEditDone}
        doneBackgroundColor={isEditEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isEditEnabled}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
      >
        <>
          <ConfirmPopup
            title={t_popup('deleteWorshipTitle')}
            body={t_popup('deleteWorshipBody')}
            buttonNum={2}
            isShow={isPopupShown}
            onClickLeftButton={onClickConfirmClose}
            onClickRightButton={() => {
              onClickDelete();
              onClickConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <AddWorship onClickDelete={onClickConfirmOpen} />
        </>
      </CustomPopup>
    </>
  );
};

export default WorshipTable;
