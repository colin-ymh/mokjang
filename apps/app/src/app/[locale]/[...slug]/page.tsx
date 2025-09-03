'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import MainLayout from '../../../components/organisms/layout/main-layout';
import {
  getContent,
  getHeader,
  getSide,
} from '../../../hooks/layout/render-layout';

import { useParams } from 'next/navigation';
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
  const slug = useParams().slug as string[] | undefined;

  const sideId = slug?.[0] ?? null;
  const headerId = slug?.[1] ?? null;
  const contentId = slug?.[2] ?? null;

  const { churchId } = useSelector((state: RootState) => state.church);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.id || !churchId) return;

    if (sideId === SIDE_ID.MAIN && !headerId) {
      router.push(`main/${MAIN_HEADER_ID.HOME}`);
    } else if (sideId === SIDE_ID.MANAGEMENT && !headerId) {
      router.push(
        `management/${MANAGEMENT_HEADER_ID.CHURCH}/${CHURCH_CONTENT_ID.CHURCH}`
      );
    }
  }, [sideId, headerId, user?.id, churchId]);

  useEffect(() => {
    if (!user?.id || !churchId) return;

    if (sideId === SIDE_ID.MAIN && !contentId) {
      if (headerId === MAIN_HEADER_ID.MEMBER) {
        router.push(`main/${MAIN_HEADER_ID.MEMBER}/${MEMBER_CONTENT_ID.ALL}`);
      } else if (headerId === MAIN_HEADER_ID.VISITATION) {
        router.push(
          `main/${MAIN_HEADER_ID.VISITATION}/${VISITATION_CONTENT_ID.ALL}`
        );
      } else if (headerId === MAIN_HEADER_ID.TASK) {
        router.push(`main/${MAIN_HEADER_ID.TASK}/${TASK_CONTENT_ID.ALL}`);
      }
    } else if (
      sideId === SIDE_ID.MANAGEMENT &&
      headerId === MANAGEMENT_HEADER_ID.CHURCH &&
      !contentId
    ) {
      router.push(
        `management/${MANAGEMENT_HEADER_ID.CHURCH}/${CHURCH_CONTENT_ID.CHURCH}`
      );
    }
  }, [sideId, headerId, contentId, user?.id, churchId, router]);

  const side = useMemo(() => {
    return sideId ? getSide(sideId) : null;
  }, [sideId]);

  const header = useMemo(() => {
    return headerId ? getHeader(headerId) : null;
  }, [headerId]);

  const content = useMemo(() => {
    return getContent(contentId, headerId);
  }, [contentId, headerId, router]);

  // 렌더링은 조건적으로 null을 반환하되, useEffect 이후로!
  if (!user?.id || !churchId) {
    return null;
  }

  return <MainLayout side={side} header={header} content={content} />;
};

export default App;
