import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setWorshipOrderBy,
  setWorshipOrderDirection,
  setWorships,
} from '@/redux/reducers/filter/worship-filter-reducer';

import { ORDER_DIRECTION } from '@/constants/constant';
import { WorshipsApi } from '@/api/worship/worships.api';
import { DEFAULT_WORSHIP, Worship } from '@/models/worship/worship';
import { setTargetWorship } from '@/redux/reducers/target/target-worship-reducer';
import { getIsWellFormedTitle } from '@/utils/check';

import { WORSHIP } from '@/constants/worship/worship-column';
import WorshipTableView from '@/components/molecules/worship/worship-table.view';

export type WorshipTableProps = {
  loadWorships: () => Promise<void>;
};

const WorshipTable = ({ loadWorships }: WorshipTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { churchId } = useSelector((state: RootState) => state.church);
  const { worships, worshipFilter, worshipOrderBy, worshipOrderDirection } =
    useSelector((state: RootState) => state.worshipFilter);
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const worshipsApi = new WorshipsApi(false);

  const [isEditModalOpened, setIsEditModalOpened] = useState<boolean>(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] =
    useState<boolean>(false);

  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickWorshipItem = (worship: Worship) => {
    // dispatch(setTargetWorship(worship));
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
      if (scrollTop + clientHeight >= scrollHeight) {
        loadWorships(); // 데이터를 추가로 로드
      }
    }
  };

  const onClickDeleteWorship = () => {
    setIsDeleteModalOpened(true);
  };

  const onClickEditWorship = (worship: Worship) => {
    setIsEditModalOpened(true);
    dispatch(setTargetWorship(worship));
  };

  const onClickCancelDelete = () => {
    setIsDeleteModalOpened(false);
  };

  const onClickConfirmDelete = (worshipId: string) => {
    try {
      worshipsApi.deleteWorship({ churchId, worshipId });

      const newWorships = worships.filter(
        (worship) => worship.id !== worshipId
      );

      dispatch(setWorships(newWorships));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsDeleteModalOpened(false);
    }
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
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    setIsEditModalOpened(false);
    dispatch(setTargetWorship(DEFAULT_WORSHIP));
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
    isEditModalOpened,
    isDeleteModalOpened,
    isEditEnabled,
    worships,
    scrollRef,
    onClickHeader,
    onScroll,
    onClickDeleteWorship,
    onClickEditWorship,
    onClickCancelDelete,
    onClickConfirmDelete,
    onClickEditDone,
    onClickEditClose,
    onClickWorshipItem,
  };

  return (
    <>
      <WorshipTableView {...props} />
    </>
  );
};

export default WorshipTable;
