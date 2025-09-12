import React, { useEffect, useRef, useState } from 'react';
import { Member, Ministry, MinistryGroup } from '@mokjang/models';
import { DESTRUCTIVE, MEMBER, ORDER_DIRECTION } from '@mokjang/constants';
import { CHURCH_CONTENT_ID } from '../../../../constants/layout/content';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { MinistryMembersApi } from '../../../../api/management/ministry/ministry-mebers.api';
import ManagementMemberTableView from './management-member-table.view';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

export type MinistryManagementMemberTableProps = {
  members: Member[];
  loadMembers: () => void;
  orderBy: MEMBER | null;
  orderDirection: ORDER_DIRECTION | null;
  onClickHeaderItem: (headerId: MEMBER) => void;
  type: CHURCH_CONTENT_ID;
  leaderMemberId?: string;
  ministries: Ministry[];
  fetchMembers: () => void;
  fetchMinistries: () => void;
  selectedMinistryGroup: MinistryGroup;
};

const MinistryManagementMemberTable = ({
  members,
  loadMembers,
  orderBy,
  orderDirection,
  onClickHeaderItem,
  type,
  leaderMemberId,
  ministries,
  fetchMembers,
  fetchMinistries,
  selectedMinistryGroup,
}: MinistryManagementMemberTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ministryMembersApi = new MinistryMembersApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);

  // 에러 처리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      // 스크롤이 최하단에 도달했는지 확인
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMembers(); // 데이터를 추가로 로드
      }
    }
  };

  const onChangeMinistry = async (ministryId: string, member: Member) => {
    try {
      // 새로운 사역이 들어오고 기존 사역이 존재 => 기존 사역 삭제
      if (!ministryId && member.ministries) {
        await ministryMembersApi.deleteMemberMinistry(
          {
            churchId,
            ministryGroupId: selectedMinistryGroup.id as string,
            ministryId: member.ministries[0].id as string,
          },
          { memberId: member.id }
        );
      }

      if (ministryId) {
        await ministryMembersApi.editMemberMinistry(
          {
            churchId,
            ministryGroupId: selectedMinistryGroup.id as string,
            ministryId,
          },
          { memberId: member.id }
        );
      }

      fetchMembers();
      fetchMinistries();
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

  // 정렬 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  const props = {
    members,
    scrollRef,
    onScroll,
    orderBy,
    orderDirection,
    onClickHeaderItem,
    type,
    leaderMemberId,
    ministries,
    onChangeMinistry,
  };

  return (
    <>
      <ManagementMemberTableView {...props} />
    </>
  );
};

export default MinistryManagementMemberTable;
