import { http } from "@/utils/http";

/** 登录 */
export const getLogin = data => {
  return http.request("post", "/auth/login", { data }, { isNeedToken: false });
};

/** 刷新token */
export const refreshTokenApi = data => {
  return http.request("post", "/auth/refreshToken", {
    data
  });
};

/** 获取管理员信息 */
export const getAdminInfo = () => {
  return http.request("get", "/back/admin/getAdminInfo");
};

/** 根据角色获取权限 */
export const getRolesById = params => {
  return http.request("get", "/back/authority/findByRole", { params });
};
// 获取人员列表
export const getAllUer = params => {
  return http.request("get", "/user", { params });
};
// 获取人员列表
export const getCurrentUer = params => {
  return http.request("get", "/auth/current", { params });
};

/** 刷新token */
export const resetUserPassword = data => {
  return http.request(
    "post",
    "/auth/resetUserPassword",
    { data },
    { isNeedToken: true }
  );
};
// 更新用户信息
export const updateUserInfoById = data => {
  return http.request(
    "post",
    "/auth/updateUserInfoById",
    { data },
    {
      isNeedToken: true
    }
  );
};
