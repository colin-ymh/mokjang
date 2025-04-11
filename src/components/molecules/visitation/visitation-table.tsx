import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchMembers,
  setMemberOrderBy,
  setMemberOrderDirection,
  setMembers,
} from '@/redux/reducers/member-filter-reducer';

import VisitationTableView from '@/components/molecules/member/list/member-table.view';
import { MEMBER } from '@/constants/member/member-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import { MembersApi } from '@/api/members/members.api';

export type VisitationTableProps = {
  onClickMemberItem: (memberId: string) => void;
  loadMembers: () => Promise<void>;
};

const VisitationTable = ({
  onClickMemberItem,
  loadMembers,
}: VisitationTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const membersApi = new MembersApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);
  const { members, memberFilter, memberOrderBy, memberOrderDirection } =
    useSelector((state: RootState) => state.memberFilter);

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickOpen = () => {
    setIsPopupShown(true);
  };

  const onClickClose = () => {
    setIsPopupShown(false);
  };

  // 선택된 교인 id 배열
  const [checkedMemberIds, setCheckedMemberIds] = useState<string[]>([]);

  // 전체 선택 버튼 이벤트
  const onClickCheckAll = () => {};

  // 특정 교인 선택 이벤트
  const onClickCheckMember = (memberId: string) => {
    // 이미 선택된 경우 => 제외
    if (checkedMemberIds.includes(memberId)) {
      const newCheckedMemberIds = checkedMemberIds.filter(
        (id) => id !== memberId
      );
      setCheckedMemberIds(newCheckedMemberIds);
    }
    // 선택되지 않은 경우 => 추가
    else {
      setCheckedMemberIds([...checkedMemberIds, memberId]);
    }
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: MEMBER) => {
    let newOrderBy = id;

    if (newOrderBy !== memberOrderBy) {
      dispatch(setMemberOrderBy(newOrderBy));
      dispatch(setMemberOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setMemberOrderDirection(
          memberOrderDirection === ORDER_DIRECTION.ASC
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
        loadMembers(); // 데이터를 추가로 로드
      }
    }
  };

  // 선택된 교인들 삭제하기
  const onClickDeleteMembers = async () => {
    try {
      // 1) 모든 삭제 요청(비동기)을 배열로 만든 후,
      const deletePromises = checkedMemberIds.map((memberId: string) => {
        return membersApi.deleteMember({ churchId, memberId });
      });

      // 2) Promise.all로 전부 완료될 때까지 대기
      await Promise.all(deletePromises);

      setCheckedMemberIds([]);
      setIsPopupShown(false);

      // 3) 모든 삭제가 끝난 후 교인 목록 다시 불러오기
      await dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
        (result) => {
          if (fetchMembers.fulfilled.match(result)) {
            dispatch(setMembers(result.payload));
          }
        }
      );
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [memberOrderBy, memberOrderDirection, memberFilter]);

  const props = {
    isPopupShown,
    onClickOpen,
    onClickClose,
    members,
    checkedMemberIds,
    onClickHeader,
    onClickMemberItem,
    scrollRef,
    onScroll,
    onClickCheckMember,
    onClickDeleteMembers,
  };

  return (
    <>
      <VisitationTableView {...props} />
    </>
  );
};

export default VisitationTable;
