import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { OAuthClientID, OAuthClientSecret } from '@milesight/shared/src/config';
import { getResponseData } from '@milesight/shared/src/utils/request';
import iotStorage, { getUserCacheKey, TOKEN_CACHE_KEY } from '@milesight/shared/src/utils/storage';

type TokenDataType = {
    /** 鉴权 Token */
    access_token: string;
    /** 刷新 Token */
    refresh_token: string;
    /** 过期时间，单位 ms */
    expires_in: number;
};
let lastTokenRefreshTime = 0;

/**
 * 通用 Token 刷新处理（每 60 分钟刷新一次 token）
 */
const oauthHandler = async (config: AxiosRequestConfig) => {
    const tokenCacheKey = getUserCacheKey(TOKEN_CACHE_KEY);

    /**
     * 1. 无 region 时不发起请求，避免跨区域接口调用耗时过长
     * 2. 无 tokenCacheKey 时不发起请求，因无用户数据，token 无法基于用户 id 做缓存
     * 3. 10 秒内若有多个并行 token 获取/更新请求，则只发起 1 次，该判断主要
     * 针对 token 接口响应报错时，避免一段时间内并行的请求同时重复发起 token 获取/刷新
     */
    if (!tokenCacheKey || Date.now() - lastTokenRefreshTime < 10 * 1000) return config;

    const token = iotStorage.getItem<TokenDataType>(tokenCacheKey);
    const isExpired = token && Date.now() >= token.expires_in;
    // TODO: 调整 apiOrigin
    const apiOrigin = '/';
    const apiPath = `${apiOrigin}/oauth/token`;
    const requestConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
    };

    /**
     * 1. 缓存中无 token（过期/未登录），调用接口获取 token
     * 2. 缓存中有 token，且已过期，则调用刷新接口，更新 token
     * 3. token 相关接口请求为异步调用，不阻塞其他接口
     */
    if (!token || isExpired) {
        const requestData = !token
            ? {
                  client_id: OAuthClientID,
                  client_secret: OAuthClientSecret,
                  grant_type: 'get_refresh_token',
              }
            : {
                  refresh_token: token.refresh_token,
                  grant_type: 'refresh_token',
              };

        lastTokenRefreshTime = Date.now();
        axios
            .post<ApiResponse<TokenDataType>>(apiPath, requestData, requestConfig)
            .then(resp => {
                const data = getResponseData(resp)!;

                // 每 60 分钟刷新一次 token
                data.expires_in = Date.now() + 60 * 60 * 1000;
                iotStorage.setItem(tokenCacheKey, data);
            })
            .catch(_ => {
                // 接口报错则直接移除 token
                iotStorage.removeItem(tokenCacheKey);
            });
    }

    return config;
};

export default oauthHandler;
