export const isAdmin = (roleId: string) => {
  return ROLES.ADMIN === roleId;
};

export const isStudent = (roleId: string) => {
  return ROLES.STUDENT === roleId;
};

export const isManagement = (roleId: string) => {
  return ROLES.MANAGEMENT === roleId;
};

export const isMentor = (roleId: string) => {
  return ROLES.MENTOR === roleId;
};

enum ROLES {
  MENTOR = "605687041228800030",
  STUDENT = "605687349111685130",
  MANAGEMENT = "650945647406481409",
  ADMIN = "605686097388765215",
}
