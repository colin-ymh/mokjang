'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { usePageRouter } from '../../../../../../packages/utils/src';
import PageLayout from '@/components/organisms/layout/page-layout';
import Contact from '@/components/organisms/contact/contact';

export default function ContactPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = usePageRouter();
  //
  // useEffect(() => {
  //   if (user?.id) {
  //     router.replace('/main'); // ✅ redirect는 useEffect 내부에서
  //   }
  // }, [user?.id, router]);
  //
  // // 로그인된 상태면 로그인 페이지는 표시하지 않음
  // if (user?.id) return null;

  return (
    <PageLayout>
      <Contact />
    </PageLayout>
  );
}
