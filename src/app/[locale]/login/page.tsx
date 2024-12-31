"use client";

import Login from "@/components/organisms/auth/login";
import AuthLayout from "@/components/organisms/layout/auth-layout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;
