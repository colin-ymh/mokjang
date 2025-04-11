'use client';

import { usePageRouter } from '@/utils/router';

const App = () => {
  const router = usePageRouter();

  router.push(`admin/main`);

  return <></>;
};

export default App;
