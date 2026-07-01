const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  // ESLint는 `npm run lint`로 명시 실행한다. 프로덕션 빌드는 기존과 동일하게
  // lint로 차단하지 않는다(현재 다수의 기존 lint 에러가 있어 빌드가 막히는 것을 방지).
  // 기존 lint 에러/경고를 정리한 뒤 이 옵션을 제거해 빌드 게이트로 승격할 것.
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SERVER_PROTOCOL: process.env.NEXT_PUBLIC_SERVER_PROTOCOL,
    NEXT_PUBLIC_SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,

    NEXT_PUBLIC_TEST_SERVER_PROTOCOL:
      process.env.NEXT_PUBLIC_TEST_SERVER_PROTOCOL,
    NEXT_PUBLIC_TEST_SERVER_HOST: process.env.NEXT_PUBLIC_TEST_SERVER_HOST,
    NEXT_PUBLIC_TEST_SERVER_PORT: process.env.NEXT_PUBLIC_TEST_SERVER_PORT,

    NEXT_PUBLIC_APP_CLIENT_PROTOCOL:
      process.env.NEXT_PUBLIC_APP_CLIENT_PROTOCOL,
    NEXT_PUBLIC_APP_CLIENT_HOST: process.env.NEXT_PUBLIC_APP_CLIENT_HOST,
    NEXT_PUBLIC_APP_CLIENT_PORT: process.env.NEXT_PUBLIC_APP_CLIENT_PORT,

    NEXT_PUBLIC_LANDING_CLIENT_PROTOCOL:
      process.env.NEXT_PUBLIC_LANDING_CLIENT_PROTOCOL,
    NEXT_PUBLIC_LANDING_CLIENT_HOST:
      process.env.NEXT_PUBLIC_LANDING_CLIENT_HOST,
    NEXT_PUBLIC_LANDING_CLIENT_PORT:
      process.env.NEXT_PUBLIC_LANDING_CLIENT_PORT,

    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};
