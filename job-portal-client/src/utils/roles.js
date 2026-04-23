export const USER_ROLES = {
  JOB_PROVIDER: "jobProvider",
  JOB_SEEKER: "jobSeeker",
};

export const getUserRole = (user) => {
  return String(user?.unsafeMetadata?.role || user?.publicMetadata?.role || "");
};