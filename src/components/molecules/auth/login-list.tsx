import { AUTH, AuthApi } from "@/api/auth/auth.api";
import { setAuthorizationToken } from "@/api/authorize-axios";
import { usePageRouter } from "@/utils/router";
import LoginListView from "@/components/molecules/auth/login-list.view";

const LoginList = () => {
  // const router = useRouter();
  const router = usePageRouter();
  const authApi = new AuthApi(false);

  const onClickItem = (provider: AUTH) => {
    // router.push(authApi.getOAuth({ provider }));
    authApi
      .getTestAuth({ provider, providerId: new Date().toString() })
      .then((response) => {
        if (response.status === 200) {
          // 최초 로그인인 경우
          if (response.data?.temporal) {
            setAuthorizationToken(response.data?.temporal);
            router.push("/login/register");
          }
        }
      });
  };

  const props = {
    onClickItem,
  };

  return (
    <>
      <LoginListView {...props} />
    </>
  );
};

export default LoginList;
