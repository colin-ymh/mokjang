import GroupHistoryListView from '@/components/molecules/member/information/history/group-history-list.view';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import { GroupHistory } from '@/models/member/history';
import { GroupHistoryApi } from '@/api/history/group-history.api';

const TAKE = 10;

const GroupHistoryList = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const groupHistoryApi = new GroupHistoryApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 초기 false로 첫 로딩 허용
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [histories, setHistories] = useState<GroupHistory[]>([]);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const fetchHistory = async () => {
    // 이미 로딩 중이거나 더 불러올 데이터가 없다면 중단
    if (isLoading || !hasMore) return;

    // churchId/targetMember 없으면 중단
    if (!churchId || !targetMember?.id) return;

    setIsLoading(true);
    try {
      const response = await groupHistoryApi.getGroupHistory({
        churchId,
        memberId: targetMember.id,
        take: TAKE,
        page,
      });

      const newHistories = (response?.data?.data ?? []) as GroupHistory[];

      if (page === 1) {
        // 첫 페이지는 교체
        setHistories(newHistories);
      } else {
        // 이후 페이지는 append + dedup(id)
        setHistories((prev) => {
          const exist = new Set(prev.map((h) => h.id));
          const append = newHistories.filter((h) => !exist.has(h.id));
          return prev.concat(append);
        });
      }

      // hasMore 갱신
      if (!newHistories.length || newHistories.length < TAKE) {
        setHasMore(false);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // targetMember가 바뀌면 초기화 후 재로딩
  useEffect(() => {
    setPage(1);
    setHistories([]);
    setHasMore(true);
    setIsLoading(false);
    // page가 1이라도 fetchHistory는 page 의존 effect에서 호출됨
  }, [targetMember?.id, churchId]);

  // 페이지 변경 시 로딩
  useEffect(() => {
    fetchHistory();
  }, [page]);

  // 스크롤 이벤트: ref가 없으면 window 스크롤로 폴백
  useEffect(() => {
    const container = scrollRef.current;
    const threshold = 16; // px

    const isNearBottom = () => {
      if (container) {
        const isScrollable =
          container.scrollHeight > container.clientHeight + 1;
        if (!isScrollable) return false;
        return (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - threshold
        );
      } else {
        const doc = document.documentElement;
        return (
          window.scrollY + window.innerHeight >= doc.scrollHeight - threshold
        );
      }
    };

    const onScroll = () => {
      if (isLoading || !hasMore) return;
      if (!isNearBottom()) return;
      setPage((prev) => prev + 1);
    };

    const target: any = container ?? window;
    target.addEventListener('scroll', onScroll);
    return () => {
      target.removeEventListener('scroll', onScroll);
    };
  }, [isLoading, hasMore]); // ref 객체는 고정이라 deps에 불필요

  const props = {
    scrollRef,
    histories,
  };

  return <GroupHistoryListView {...props} />;
};

export default GroupHistoryList;
