import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { BLANK, CHURCH_USER_ROLE, ORDER_DIRECTION } from '@/constants/constant';
import {
  setJoinRequestOrderBy,
  setJoinRequestOrderDirection,
  setJoinRequests,
} from '@/redux/reducers/filter/join-request-filter-reducer';
import JoinRequestTableView from '@/components/molecules/join-request/join-request-table.view';
import { JOIN_REQUEST } from '@/constants/join-request/join-request-column';
import { USER } from '@/constants/user/user-column';
import { JoinRequestsApi } from '@/api/join-request/join-request.api';
import {
  DEFAULT_JOIN_REQUEST,
  JoinRequest,
} from '@/models/join-request/join-request';
import { setTargetJoinRequest } from '@/redux/reducers/target/target-join-request-reducer';

export type JoinRequestTableProps = {
  loadJoinRequests: () => Promise<void>;
};

const JoinRequestTable = ({ loadJoinRequests }: JoinRequestTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const joinRequestsApi = new JoinRequestsApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetJoinRequest } = useSelector(
    (state: RootState) => state.targetJoinRequest
  );
  const [isLinkPopupShown, setIsLinkPopupShown] = useState<boolean>(false);

  const [targetLinkMemberId, setTargetLinkMemberId] = useState<string>(BLANK);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const {
    joinRequests,
    joinRequestFilter,
    joinRequestOrderBy,
    joinRequestOrderDirection,
  } = useSelector((state: RootState) => state.joinRequestFilter);

  // 팝업 열기
  const onClickOpenLink = (target: JoinRequest) => {
    setIsLinkPopupShown(true);
    dispatch(setTargetJoinRequest(target));
  };

  // 승인
  const onClickApprove = async () => {
    try {
      await joinRequestsApi
        .approveJoinRequest(
          { churchId, joinId: targetJoinRequest.id },
          {
            linkMemberId: targetLinkMemberId,
            userRole: CHURCH_USER_ROLE.MANAGER,
          }
        )
        .then((response) => {
          const newJoinRequests = joinRequests.filter(
            (request) => request.id !== targetJoinRequest.id
          );
          dispatch(setJoinRequests(newJoinRequests));
          setTargetLinkMemberId(BLANK);
          setIsLinkPopupShown(false);
          dispatch(setTargetJoinRequest(DEFAULT_JOIN_REQUEST));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 팝업 닫기
  const onClickCancelLink = () => {
    setIsLinkPopupShown(false);
    dispatch(setTargetJoinRequest(DEFAULT_JOIN_REQUEST));
    setTargetLinkMemberId(BLANK);
  };

  // 거절
  const onClickReject = async (joinId: string) => {
    try {
      await joinRequestsApi
        .rejectJoinRequest({ churchId, joinId })
        .then((response) => {
          const newJoinRequests = joinRequests.filter(
            (request) => request.id !== joinId
          );
          dispatch(setJoinRequests(newJoinRequests));
          setTargetLinkMemberId(BLANK);
          setIsLinkPopupShown(false);
          dispatch(setTargetJoinRequest(DEFAULT_JOIN_REQUEST));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 연결할 교인
  const onChangeLinkMember = (memberId: string) => {
    setTargetLinkMemberId(memberId);
  };

  // 열 헤더를 눌러 정렬
  const onClickHeader = (id: JOIN_REQUEST | USER) => {
    let newOrderBy = id;

    if (newOrderBy !== joinRequestOrderBy) {
      dispatch(setJoinRequestOrderBy(newOrderBy));
      dispatch(setJoinRequestOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setJoinRequestOrderDirection(
          joinRequestOrderDirection === ORDER_DIRECTION.ASC
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
        loadJoinRequests(); // 데이터를 추가로 로드
      }
    }
  };

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [joinRequestOrderBy, joinRequestOrderDirection, joinRequestFilter]);

  const props = {
    isLinkPopupShown,
    joinRequests,
    onClickHeader,
    scrollRef,
    onScroll,
    onClickOpenLink,
    onClickApprove,
    onClickCancelLink,
    onClickReject,
    onChangeLinkMember,
  };

  return (
    <>
      <JoinRequestTableView {...props} />
    </>
  );
};

export default JoinRequestTable;
