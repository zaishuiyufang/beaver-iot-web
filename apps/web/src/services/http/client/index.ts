import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createRequestClient, attachAPI } from '@milesight/shared/src/utils/request';
import { getCurrentMomentLang } from '@milesight/shared/src/services/i18n';
import errorHandler from './error-handlers';

/**
 * 业务请求头配置（非动态请求头直接在 headers 中配置即可）
 */
const headerHandler = async (config: AxiosRequestConfig) => {
    config.headers = config.headers || {};
    config.headers['Accept-Language'] = getCurrentMomentLang();

    return config;
};

/**
 * 判断 API 请求是否成功
 */
const isRequestSuccess = (resp: AxiosResponse<ApiResponse>) => {
    const data = resp?.data;

    return !!data && !data.errMsg && resp.data.status === 'Success';
};

const client = createRequestClient({
    baseURL: '/',
    // 静态接口请求头
    // headers: {
    //     'x-headers': 'xxx',
    // },
    configHandlers: [headerHandler],
    onResponse(resp) {
        // 错误处理
        errorHandler(resp.data.errCode, resp);
        return resp;
    },
    onResponseError(error) {
        const resp = error.response;
        // @ts-ignore
        errorHandler(resp?.data?.errCode, resp);
        return error;
    },
});

export { client, attachAPI, isRequestSuccess };
