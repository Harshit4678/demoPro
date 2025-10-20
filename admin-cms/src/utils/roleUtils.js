export const hasRole = (user, roles = []) => {
  if (!user) return false;
  if (!roles?.length) return true;
  return roles.includes(user.role);
};
