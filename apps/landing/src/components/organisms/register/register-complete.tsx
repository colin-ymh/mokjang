import RegisterCompleteView, {
  RegisterCompleteViewProps,
} from '@/components/organisms/register/register-complete.view';
import { usePageRouter } from '@mokjang/utils';

const RegisterComplete = () => {
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
  } as RegisterCompleteViewProps;
  return (
    <>
      <RegisterCompleteView {...props} />
    </>
  );
};

export default RegisterComplete;
