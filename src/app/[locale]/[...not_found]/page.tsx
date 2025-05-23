'use client';

import { usePageRouter } from '@/utils/router';

const NotFound = () => {
  const router = usePageRouter();

  router.push(`admin/main`);

  return <></>;
};

export default NotFound;
