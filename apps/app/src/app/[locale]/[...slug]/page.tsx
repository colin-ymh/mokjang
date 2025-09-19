'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import MainLayout from '../../../components/organisms/layout/main-layout';
import {
  getContent,
  getHeader,
  getSide,
} from '../../../hooks/layout/render-layout';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import {
  MAIN_HEADER_ID,
  MANAGEMENT_HEADER_ID,
  SIDE_ID,
} from '../../../constants/layout/header';
import {
  CHURCH_CONTENT_ID,
  MEMBER_CONTENT_ID,
  TASK_CONTENT_ID,
  VISITATION_CONTENT_ID,
} from '../../../constants/layout/content';
import { usePageRouter } from '@mokjang/utils';

const App = () => {
  const router = usePageRouter();
  const pathname = usePathname();
  const slug = useParams().slug as string[] | undefined;

  const sideId = slug?.[0] ?? null;
  const headerId = slug?.[1] ?? null;
  const contentId = slug?.[2] ?? null;

  const { churchId } = useSelector((state: RootState) => state.church);
  const { initialized, user } = useSelector((state: RootState) => state.user);

  // ✅ 단일 useEffect로 기본 경로 유도
  useEffect(() => {
    if (!initialized || !user?.id || !churchId) return;

    let targetPath: string | null = null;

    if (sideId === SIDE_ID.MAIN) {
      if (!headerId) {
        targetPath = `/main/${MAIN_HEADER_ID.HOME}`;
      } else if (!contentId) {
        if (headerId === MAIN_HEADER_ID.MEMBER) {
          targetPath = `/main/${MAIN_HEADER_ID.MEMBER}/${MEMBER_CONTENT_ID.ALL}`;
        } else if (headerId === MAIN_HEADER_ID.VISITATION) {
          targetPath = `/main/${MAIN_HEADER_ID.VISITATION}/${VISITATION_CONTENT_ID.ALL}`;
        } else if (headerId === MAIN_HEADER_ID.TASK) {
          targetPath = `/main/${MAIN_HEADER_ID.TASK}/${TASK_CONTENT_ID.ALL}`;
        }
      }
    } else if (sideId === SIDE_ID.MANAGEMENT) {
      if (!headerId) {
        targetPath = `/management/${MANAGEMENT_HEADER_ID.CHURCH}/${CHURCH_CONTENT_ID.CHURCH}`;
      } else if (headerId === MANAGEMENT_HEADER_ID.CHURCH && !contentId) {
        targetPath = `/management/${MANAGEMENT_HEADER_ID.CHURCH}/${CHURCH_CONTENT_ID.CHURCH}`;
      }
    }

    // 이미 해당 경로면 이동하지 않음
    if (targetPath && pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [
    initialized,
    user?.id,
    churchId,
    sideId,
    headerId,
    contentId,
    pathname,
    router,
  ]);

  const side = useMemo(() => (sideId ? getSide(sideId) : null), [sideId]);
  const header = useMemo(
    () => (headerId ? getHeader(headerId) : null),
    [headerId]
  );
  const content = useMemo(
    () => getContent(contentId, headerId),
    [contentId, headerId]
  );

  if (!initialized) return null; // 필요시 로딩 UI로 대체
  if (!user?.id || !churchId) return null;

  return <MainLayout side={side} header={header} content={content} />;
};

export default App;
