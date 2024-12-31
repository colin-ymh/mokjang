"use client";

import UserRegister from "@/components/organisms/auth/user-register";
import AuthLayout from "@/components/organisms/layout/auth-layout";

const UserRegisterPage = () => {
  return (
    <AuthLayout>
      <UserRegister />
    </AuthLayout>
  );
};

export default UserRegisterPage;
