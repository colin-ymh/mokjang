import HeaderView, { HeaderViewProps } from './header.view';
import { useEffect, useState } from 'react';
import { usePageRouter } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@mokjang/app/src/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@mokjang/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { SubscriptionApi } from '@/api/subscription/subscription.api';
import { DEFAULT_SUBSCRIPTION_PLAN, SubscriptionPlan } from '@mokjang/models';
import { setSubscription } from '@/redux/reducers/subscription-reducer';
import { MAIN_CONTENT_ID } from '@/constants/constant';

type HeaderProps = {};

const MAIN_Y_OFFSET = {
  [MAIN_CONTENT_ID.HOME]: 0,
  [MAIN_CONTENT_ID.FUNCTION]: 700,
  [MAIN_CONTENT_ID.FAQ]: 700 + 900,
  // [MAIN_CONTENT_ID.PRICE]: 700 + 850,
  // [MAIN_CONTENT_ID.FAQ]: 700 + 850 + 900,
};

const Header = ({}: HeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();
  const content = pathname.split('/')[2];

  const router = usePageRouter();

  const subscriptionApi = new SubscriptionApi(false);

  const [focusedContent, setFocusedContent] = useState<
    MAIN_CONTENT_ID | undefined
  >(undefined);

  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [targetY, setTargetY] = useState<number | null>(null);

  const [isProfileOpened, setIsProfileOpened] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickLogo = () => {
    router.push('/');
  };

  const onClickMenu = (
    id: MAIN_CONTENT_ID.FUNCTION | MAIN_CONTENT_ID.HOME | MAIN_CONTENT_ID.FAQ
  ) => {
    if (content) {
      router.push('/');

      setTimeout(() => {
        const yOffset = MAIN_Y_OFFSET[id];
        // 미리 포커스를 고정 (중간 섹션을 지나가도 포커스가 흔들리지 않도록)
        setFocusedContent(id);
        setIsAutoScrolling(true);
        setTargetY(yOffset);

        window.scrollTo({
          top: yOffset,
          behavior: 'smooth',
        });
      }, 300);
    } else {
      const yOffset = MAIN_Y_OFFSET[id];
      // 미리 포커스를 고정 (중간 섹션을 지나가도 포커스가 흔들리지 않도록)
      setFocusedContent(id);
      setIsAutoScrolling(true);
      setTargetY(yOffset);

      window.scrollTo({
        top: yOffset,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const EPS = 3; // 스크롤 도달 허용 오차(px)
    const onScroll = () => {
      const currentY = window.pageYOffset;

      // 프로그램적 스크롤 중에는 중간 섹션에 의한 포커스 변경을 막는다
      if (isAutoScrolling) {
        if (targetY !== null && Math.abs(currentY - targetY) <= EPS) {
          // 목적지에 거의 도달하면 잠금 해제
          setIsAutoScrolling(false);
          setTargetY(null);
        }
        return; // 잠금 중에는 아래 포커스 판정 로직을 건너뜀
      }

      if (currentY >= MAIN_Y_OFFSET[MAIN_CONTENT_ID.FAQ]) {
        setFocusedContent(MAIN_CONTENT_ID.FAQ);
      }
      // else if (currentY >= MAIN_Y_OFFSET[MAIN_CONTENT_ID.PRICE]) {
      //   setFocusedContent(MAIN_CONTENT_ID.PRICE);
      // }
      else if (currentY >= MAIN_Y_OFFSET[MAIN_CONTENT_ID.FUNCTION]) {
        setFocusedContent(MAIN_CONTENT_ID.FUNCTION);
      } else {
        setFocusedContent(undefined);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAutoScrolling, targetY]);

  useEffect(() => {
    if (!isAutoScrolling) return;
    const cancel = () => setIsAutoScrolling(false);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    return () => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
    };
  }, [isAutoScrolling]);

  const onClickLogin = () => {
    router.push('/login');
  };
  const onClickContact = () => {
    // router.push('/contact');
    //   https://forms.gle/ABc2SPpYkdpAn5k96 로 이동
    window.open(
      'https://forms.gle/ABc2SPpYkdpAn5k96',
      '_blank',
      'noopener,noreferrer'
    );
  };
  const onClickFreeTrial = async () => {
    try {
      await subscriptionApi.getFreeTrial();
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

  const fetchCurrentSubscription = async () => {
    // 구독 정보 있음
    try {
      const response = await subscriptionApi.getCurrentSubscription();
      const currentSubscription: SubscriptionPlan = response.data;

      dispatch(setSubscription(currentSubscription));
    } catch (error) {
      // 현재 구독 정보 없음
      dispatch(setSubscription(DEFAULT_SUBSCRIPTION_PLAN));
    }
  };

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const onClickProfile = () => {
    setIsProfileOpened(true);
  };

  const onClickProfileClose = () => {
    setIsProfileOpened(false);
  };

  const props = {
    focusedContent,
    onClickLogo,
    onClickMenu,
    onClickLogin,
    onClickContact,
    onClickFreeTrial,
    isProfileOpened,
    onClickProfile,
    onClickProfileClose,
  } as HeaderViewProps;

  return (
    <>
      <HeaderView {...props} />
    </>
  );
};

export default Header;
