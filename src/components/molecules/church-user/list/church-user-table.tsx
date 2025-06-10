import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { CHURCH_USER } from '@/constants/church-user/church-user-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import {
  setChurchUserOrderBy,
  setChurchUserOrderDirection,
} from '@/redux/reducers/filter/church-user-filter-reducer';
import ChurchUserTableView from '@/components/molecules/church-user/list/church-user-table.view';
import { ChurchUser } from '@/models/church-user/church-user';

export type UserTableProps = {
  onClickUserItem: (user: ChurchUser) => void;
  loadUsers: () => Promise<void>;
};

const ChurchUserTable = ({ onClickUserItem, loadUsers }: UserTableProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { churchUserFilter, churchUserOrderBy, churchUserOrderDirection } =
    useSelector((state: RootState) => state.churchUserFilter);

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: CHURCH_USER) => {
    let newOrderBy = id;

    if (newOrderBy !== churchUserOrderBy) {
      dispatch(setChurchUserOrderBy(newOrderBy));
      dispatch(setChurchUserOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setChurchUserOrderDirection(
          churchUserOrderDirection === ORDER_DIRECTION.ASC
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
        loadUsers(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [churchUserOrderBy, churchUserOrderDirection, churchUserFilter]);

  const props = {
    onClickHeader,
    onClickUserItem,
    scrollRef,
    onScroll,
  };

  return (
    <>
      <ChurchUserTableView {...props} />
    </>
  );
};

export default ChurchUserTable;
