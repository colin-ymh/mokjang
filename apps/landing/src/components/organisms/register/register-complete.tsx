import RegisterCompleteView, {
  RegisterCompleteViewProps,
} from '@/components/organisms/register/register-complete.view';
import { usePageRouter } from '@mokjang/utils';
import { routeAppPage } from '@/utils/router';

const RegisterComplete = () => {
  const router = usePageRouter();

  const onClickCreateChurch = () => {
    // router.push('/subscription');
    routeAppPage('/church/register');
  };

  const onClickJoin = () => {
    router.push('/join');
  };
  const props = {
    onClickCreateChurch,
    onClickJoin,
  } as RegisterCompleteViewProps;
  return (
    <>
      <RegisterCompleteView {...props} />
    </>
  );
};

export default RegisterComplete;
