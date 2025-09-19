import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ChurchUser } from '@mokjang/models';
import PermissionManagerInformationView from '@/components/organisms/permission/manager/permission-manager-information.view';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@mokjang/constants';

type PermissionDetailInformationProps = {};

const PermissionManagerInformation = ({}: PermissionDetailInformationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );
  const { churchId } = useSelector((state: RootState) => state.church);

  const permissionApi = useMemo(() => new PermissionsApi(false), []);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [managers, setManagers] = useState<ChurchUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const TAKE = 30;

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) throw thrownError;

  const fetchManagers = useCallback(
    async (nextPage: number) => {
      try {
        if (targetPermissionTemplate.id === 'owner') return;
        if (isLoading || !hasMore) return;
        if (!churchId || !targetPermissionTemplate?.id) return;

        setIsLoading(true);

        const response = await permissionApi.getPermissionManagers({
          churchId,
          templateId: targetPermissionTemplate.id,
          take: TAKE,
          page: nextPage,
        });

        // 응답 방어 코딩
        const newManagers: ChurchUser[] = response?.data?.data;

        setManagers((prev) =>
          nextPage === 1 ? newManagers : [...prev, ...newManagers]
        );

        if (!newManagers || newManagers.length < TAKE) {
          setHasMore(false);
        }

        setPage(nextPage);
      } catch (error) {
        if (error instanceof Error) {
          dispatch(setToastText(error.message));
          dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
          dispatch(setIsToastShown(true));
        } else {
          setThrownError(new Error(String(error)));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [targetPermissionTemplate?.id]
  );

  // 초기 로드 및 의존성 변경 시 리셋
  useEffect(() => {
    if (!churchId || !targetPermissionTemplate?.id) return;

    setManagers([]);
    setPage(1);
    setHasMore(true);

    fetchManagers(1);
  }, [churchId, targetPermissionTemplate?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        fetchManagers(page + 1);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const props = {
    scrollRef,
    managers,
  };

  return (
    <>
      <PermissionManagerInformationView {...props} />
    </>
  );
};

export default PermissionManagerInformation;
