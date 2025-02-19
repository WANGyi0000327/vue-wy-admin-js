import { formatToken, getToken } from "@/utils/auth";
import baseUrl from "@/utils/http/base";
import axios from "axios";
import { getFileMD5 } from "../md5";

export const uploadFileBase = async (file, callback) => {
  return new Promise((resolve, reject) => {
    getFileMD5(file, async md5 => {
      const token = getToken()?.accessToken || "";
      const authToken = formatToken(token);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileMd5", md5);
      const uploadUrl = `${baseUrl.apiServer}/alioss/uploadBase`;
      axios({
        method: "POST",
        url: uploadUrl,
        headers: {
          Authorization: authToken
        },
        data: formData,
        onUploadProgress: progressEvent => {
          console.log("🎁-----progressEvent-----", progressEvent);
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          // const progress = progressEvent.progress.toFixed(2);
          callback(progress);
        }
      })
        .then(response => {
          console.log("上传成功:", response.data);
          resolve(response.data);
        })
        .catch(error => {
          console.error("上传失败:", error);
          reject(error);
        });
    });
  });
};
