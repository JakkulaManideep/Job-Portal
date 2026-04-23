import React from "react";
import { Navigate } from "react-router-dom";
import { SignUp, useUser } from "@clerk/clerk-react";
import { getUserRole } from "../utils/roles";

const Signup = () => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    const role = getUserRole(user);
    return <Navigate to={role ? "/" : "/select-role"} replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <SignUp path="/sign-up" routing="path" signInUrl="/login" forceRedirectUrl="/select-role" />
    </div>
  );
};

export default Signup;