import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createRequestClient, attachAPI } from '@milesight/shared/src/utils/request';
import { getCurrentMomentLang } from '@milesight/shared/src/services/i18n';
import errorHandlers from './error-handlers';

/**
 * 业务请求头配置（非动态请求头直接在 headers 中配置即可）
 */
const headerHandler = async (config: AxiosRequestConfig) => {
    config.headers = config.headers || {};
    config.headers['Accept-Language'] = getCurrentMomentLang();

    return config;
};

/**
 * 无操作自动跳转逻辑处理
 *
 * 注意：需排除 dashboard 等报表页面（通过 _isAutoRefresh 私有参数标识）
 * Todo: auto refresh 参数移到 headers 中传入
 */
const autoJumpHandler = (() => {
    let autoJumpTimer: ReturnType<typeof setTimeout> | null = null;
    // 管理端超时默认时长（30 分钟）
    const autoJumpTimeout = 30 * 60 * 1000;
    const autoJumpPath = '/';

    return async (config: AxiosRequestConfig) => {
        // 判断参数中是否有自动刷新标识
        const isAutoRefresh = config.data?._isAutoRefresh || config.params?._isAutoRefresh;

        if (isAutoRefresh) {
            // 移除前端私有参数（约定所有前端私有参数以 _ 下划线开头来命名）
            try {
                delete config.data?._isAutoRefresh;
                delete config.params?._isAutoRefresh;
            } catch (e) {}
        } else {
            /**
             * 「管理端」若长时间无操作，需自动跳转回「用户端」首页，前端的处理逻辑是基于
             * 每个请求发起时开始计时，30 分钟内无其他请求则自动跳转
             *
             * 注意：自动刷新不计为用户操作
             */
            if (autoJumpTimer) clearTimeout(autoJumpTimer);
            autoJumpTimer = setTimeout(() => {
                window.location.href = autoJumpPath;
            }, autoJumpTimeout);
        }

        return config;
    };
})();

/**
 * 判断 API 请求是否成功
 */
const isRequestSuccess = (resp: AxiosResponse<ApiResponse>) => {
    const data = resp?.data;

    return !!data && !data.errMsg && resp.data.status === 'Success';
};

const client = createRequestClient({
    baseURL: 'https://xxx.host.com',
    // 静态接口请求头
    // headers: {
    //     'x-headers': 'xxx',
    // },
    configHandlers: [headerHandler, autoJumpHandler],
    onResponse(resp) {
        // Todo: 全局通用响应处理
        if (!isRequestSuccess(resp)) {
            const errMsg = resp.data.errMsg || '';
            const handler = errorHandlers.find(item => item.errMsgs.includes(errMsg));

            handler?.handler(errMsg, resp);
        }

        return resp;
    },
    onResponseError(error) {
        // Todo: 全局通用错误处理
        return error;
    },
});

export { client, attachAPI, isRequestSuccess };
