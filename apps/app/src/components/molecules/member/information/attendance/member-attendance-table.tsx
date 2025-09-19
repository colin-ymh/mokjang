import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';

import { BLANK, ORDER_DIRECTION } from '@mokjang/constants';
import { WorshipAttendance } from '@mokjang/models';
import { MembersApi } from '../../../../../api/members/members.api';
import MemberAttendanceTableView from './member-attendance-table.view';

export type MemberAttendanceTableProps = {};

const MemberAttendanceTable = ({}: MemberAttendanceTableProps) => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const { worshipEnrollmentFilter } = useSelector(
    (state: RootState) => state.worshipEnrollmentFilter
  );
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );

  const membersApi = new MembersApi(false);

  const [attendances, setAttendances] = useState<WorshipAttendance[]>([]);

  const [cursor, setCursor] = useState<string>(BLANK);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  // 리셋 이후, 의존 값들이 준비되면 최초 1회 로드를 트리거하기 위한 플래그
  const [needsInitialLoad, setNeedsInitialLoad] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const scrollRef = useRef(null);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    try {
      const el = e.currentTarget as HTMLElement | null;
      if (!el || isLoading || !hasMore) return;

      const scrollTop = el.scrollTop ?? 0;
      const clientHeight = el.clientHeight ?? 0;
      const scrollHeight = el.scrollHeight ?? 0;

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 약간의 여유를 두고 하단 감지

      if (isAtBottom) {
        void fetchAttendances();
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const fetchAttendances = async (cursorArg?: string) => {
    if (isFetchingRef.current || isLoading || !hasMore) return;
    if (!targetWorship.id) return;
    if (
      !worshipEnrollmentFilter.fromSessionDate ||
      !worshipEnrollmentFilter.toSessionDate
    )
      return;

    // setState 비동기성으로 인해 바로 다음 줄에서 최신 커서가 반영되지 않을 수 있으므로 인자로 받은 cursorArg를 우선 사용
    const effectiveCursor = cursorArg ?? cursor;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const response = await membersApi.getMemberWorshipAttendances({
        churchId,
        memberId: targetMember.id,
        worshipId: targetWorship.id,
        // limit: 30,
        cursor: effectiveCursor,
        from: worshipEnrollmentFilter.fromSessionDate,
        to: worshipEnrollmentFilter.toSessionDate,
        sortDirection: ORDER_DIRECTION.DESC,
      });

      const newItems: WorshipAttendance[] = response?.data?.data ?? [];

      // Append while preventing accidental duplicates by id
      setAttendances((prev) => {
        const seen = new Set(
          prev.map(
            (a) =>
              (a as any).id ?? `${(a as any).sessionId}-${(a as any).memberId}`
          )
        );
        const filtered = newItems.filter((a: any) => {
          const key = a?.id ?? `${a?.sessionId}-${a?.memberId}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return prev.concat(filtered);
      });

      // Advance cursor; support multiple possible field names from API
      const nextCursor: string =
        (response?.data?.nextCursor as string) ??
        (response?.data?.cursor as string) ??
        BLANK;

      if (
        !nextCursor ||
        newItems.length === 0 ||
        nextCursor === effectiveCursor
      ) {
        setHasMore(false);
      }
      setCursor(nextCursor || BLANK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  // 필터나 대상이 변경될 때, 페이지네이션과 데이터를 초기화하고 다시 불러오기
  const resetAndFetchAttendances = async () => {
    try {
      // attendances, 커서, hasMore 값 초기화
      setAttendances([]);
      setCursor(BLANK);
      setHasMore(true);
      isFetchingRef.current = false;
      // 강제로 처음부터 조회 → 의존 값(타겟/기간)이 아직 준비되지 않은 타이밍일 수 있으므로 플래그로 지연 실행
      setNeedsInitialLoad(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 리셋 직후 의존 값들이 준비되면 최초 1회 데이터 로드
  useEffect(() => {
    // 필수 값이 모두 존재하는지 확인 (가드 조건과 동일하게 맞춰줌)
    const ready = Boolean(
      churchId &&
        targetMember?.id &&
        targetWorship?.id &&
        worshipEnrollmentFilter.fromSessionDate &&
        worshipEnrollmentFilter.toSessionDate
    );

    if (!needsInitialLoad || !ready || isLoading || isFetchingRef.current)
      return;

    (async () => {
      try {
        await fetchAttendances(BLANK); // 처음부터 조회
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      } finally {
        setNeedsInitialLoad(false); // 최초 로드 플래그 해제
      }
    })();
  }, [
    needsInitialLoad,
    churchId,
    targetMember?.id,
    targetWorship?.id,
    worshipEnrollmentFilter.fromSessionDate,
    worshipEnrollmentFilter.toSessionDate,
    isLoading,
  ]);

  useEffect(() => {
    resetAndFetchAttendances();
    // 의존성: 조회 대상 또는 필터 변경 시
  }, [
    churchId,
    targetMember?.id,
    targetWorship?.id,
    worshipEnrollmentFilter.fromSessionDate,
    worshipEnrollmentFilter.toSessionDate,
  ]);

  const props = {
    scrollRef,
    onScroll,
    attendances,
  };

  return (
    <>
      <MemberAttendanceTableView {...props} />
    </>
  );
};

export default MemberAttendanceTable;
