import { useUserStoreHook } from "@/store/modules/user";
import { formatToken, getToken } from "@/utils/auth";
import { encrypt } from "@/utils/auth/sign";
import Axios from "axios";
import { stringify } from "qs";
import NProgress from "../progress";
import baseUrl from "./base";
import { isEmpty } from "@iceywu/utils";
// import { AxiosCanceler } from "./axiosCancel";
// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig = {
  // 当前使用mock模拟请求，将baseURL制空
  baseURL: baseUrl.apiServer,
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify
  }
};

class PureHttp {
  constructor() {
    PureHttp.httpInterceptorsRequest();
    PureHttp.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  static requests = [];

  /** 防止重复刷新token */
  static isRefreshing = false;
  /** 防止重复刷新token */
  static isNeedLoading = false;

  // 接口是否异常
  static isApiError = false;

  // 业务异常code名单
  static errorCodes = [401, 403];

  /** 初始化配置对象 */
  static initConfig = {};

  /** 保存当前Axios实例对象 */
  static axiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  static retryOriginalRequest(config) {
    return new Promise(resolve => {
      PureHttp.requests.push(token => {
        config.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  static httpInterceptorsRequest() {
    PureHttp.axiosInstance.interceptors.request.use(
      async config => {
        const {
          isNeedToken = true,
          isNeedLoading = false,
          isNeedEncrypt = false,
          serverName,
          headers = {}
        } = config;
        PureHttp.isNeedLoading = isNeedLoading;
        if (serverName) {
          config.baseURL = baseUrl[serverName] || baseUrl["apiServer"];
        }
        if (import.meta.env.VITE_APP_MOCK_IN_DEVELOPMENT === "true") {
          config.baseURL = "";
        }
        // header信息
        if (!isEmpty(headers)) {
          Object.keys(headers).forEach(key => {
            config.headers.set(key, headers[key]);
          });
        }
        // config.baseURL = "";
        // 参数处理
        if (isNeedEncrypt) {
          const { data, method, params } = config;
          const { tempData, nonce, timestamp, sign } = encrypt(
            method === "get" ? params : data
          );
          config.headers.timestamp = timestamp;
          config.headers.nonce = nonce;
          config.headers.sign = sign;
          if (method === "get") {
            config.params = tempData;
          } else {
            config.data = tempData;
            // config.params = encrypt(params);
          }
        }
        // config.baseURL = "";

        // 开启进度条动画
        isNeedLoading && NProgress.start();

        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }

        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */

        return !isNeedToken
          ? config
          : new Promise(resolve => {
              const data = getToken();

              if (data) {
                const now = new Date().getTime();
                const expired = parseInt(data.expires) - now <= 0;

                if (expired) {
                  if (!PureHttp.isRefreshing) {
                    PureHttp.isRefreshing = true;
                    // token过期刷新
                    useUserStoreHook()
                      .handRefreshToken({ refreshToken: data.refreshToken })
                      .then(res => {
                        const token = res.data.accessToken;
                        config.headers["Authorization"] = formatToken(token);
                        PureHttp.requests.forEach(cb => cb(token));
                        PureHttp.requests = [];
                      })
                      .finally(() => {
                        PureHttp.isRefreshing = false;
                      });
                  }
                  resolve(PureHttp.retryOriginalRequest(config));
                } else {
                  config.headers["Authorization"] = formatToken(
                    data.accessToken
                  );
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  static httpInterceptorsResponse() {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      response => {
        const $config = response.config;
        // 关闭进度条动画
        if (PureHttp.isNeedLoading && !PureHttp.isApiError) {
          NProgress.done();
        }
        const { code } = response.data;
        // 业务异常code名单
        if (PureHttp.errorCodes.includes(code)) {
          PureHttp.isApiError = true;

          return response;
          // return Promise.reject(response)
        }
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      error => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
        // return Promise.resolve({
        //   ...error.response.data
        // });
      }
    );
  }

  /** 通用请求工具函数 */
  request(method, url, param, axiosConfig) {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    };

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的`post`工具函数 */
  post(url, params, config) {
    return this.request("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  get(url, params, config) {
    return this.request("get", url, params, config);
  }
}

export const http = new PureHttp();
