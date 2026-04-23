import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { USER_ROLES, getUserRole } from "../utils/roles";

const RoleSelection = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = getUserRole(user);

  if (currentRole) {
    return <Navigate to="/" replace />;
  }

  const setRole = async (role) => {
    await user.update({
      unsafeMetadata: {
        ...(user.unsafeMetadata || {}),
        role,
      },
    });

    window.location.href = "/";
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full border rounded-md p-8 shadow-sm bg-white">
        <h1 className="text-2xl font-bold mb-2 text-center">Choose your role</h1>
        <p className="text-center text-gray-600 mb-6">
          Select how you want to use JobJunction. You can change this later in Clerk dashboard if needed.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole(USER_ROLES.JOB_PROVIDER)}
            className="border rounded p-4 hover:border-blue hover:bg-blue/5 text-left"
          >
            <p className="font-semibold">Job Provider</p>
            <p className="text-sm text-gray-600 mt-1">Post jobs and manage your listings.</p>
          </button>

          <button
            type="button"
            onClick={() => setRole(USER_ROLES.JOB_SEEKER)}
            className="border rounded p-4 hover:border-blue hover:bg-blue/5 text-left"
          >
            <p className="font-semibold">Job Seeker</p>
            <p className="text-sm text-gray-600 mt-1">Browse jobs and apply with your resume.</p>
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already signed in with wrong account? <Link to="/" className="text-blue underline">Go home</Link>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;