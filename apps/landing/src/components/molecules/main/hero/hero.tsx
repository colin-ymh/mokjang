import HeroView, {
  HeroViewProps,
} from '@/components/molecules/main/hero/hero.view';
import { usePageRouter } from '@mokjang/utils';

const Hero = () => {
  const router = usePageRouter();

  const onClickCreateChurch = () => {
    router.push('/subscription');
  };

  const onClickJoin = () => {
    router.push('/join');
  };

  const props = {
    onClickCreateChurch,
    onClickJoin,
  } as HeroViewProps;

  return (
    <>
      <HeroView {...props} />
    </>
  );
};

export default Hero;
