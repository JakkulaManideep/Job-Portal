import React from "react";
import { Navigate } from "react-router-dom";
import { SignIn, useUser } from "@clerk/clerk-react";
import { getUserRole } from "../utils/roles";

const Login = () => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    const role = getUserRole(user);
    return <Navigate to={role ? "/" : "/select-role"} replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <SignIn path="/login" routing="path" signUpUrl="/sign-up" forceRedirectUrl="/select-role" />
    </div>
  );
};

export default Login;