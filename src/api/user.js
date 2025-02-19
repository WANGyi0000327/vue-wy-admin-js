import { http } from "@/utils/http";

/** 登录 */
export const getLogin = data => {
  return http.request("post", "/login", { data }, { isNeedToken: false });
};

/** 刷新`token` */
export const refreshTokenApi = data => {
  return http.request("post", "/refresh-token", { data });
};

/** 账户设置-个人信息 */
export const getMine = data => {
  return http.request("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = data => {
  return http.request("get", "/mine-logs", { data });
};
