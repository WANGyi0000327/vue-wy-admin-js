import { http } from "@/utils/http";

/** 查询所有 */
export const fileFindAll = params => {
  return http.request("get", "/file", { params });
};
/** 删除 */
export const fileDeleteById = params => {
  return http.request("delete", `/file/${params?.id}`, { params });
};
/** 更新 */
export const fileUpdateById = data => {
  return http.request("patch", `/file/${data?.id}`, { data });
};
