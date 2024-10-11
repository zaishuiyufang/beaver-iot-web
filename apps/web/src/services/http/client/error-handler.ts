/**
 * 错误码黑名单
 *
 * 黑名单中的错误码由全局统一处理，业务中无需额外编写处理逻辑
 */
import type { AxiosResponse } from 'axios';
import { noop } from 'lodash-es';
import intl from 'react-intl-universal';
import { toast } from '@milesight/shared/src/components';
import { isRequestSuccess } from '@milesight/shared/src/utils/request';
import { errorKeyMaps } from '@milesight/shared/src/services/i18n';
import type { RequestFunctionOptions } from '@milesight/shared/src/utils/request/types';

type ErrorHandlerConfig = {
    /** 错误码集合 */
    errCodes: string[];

    /** 处理函数 */
    handler: (errCode?: string, resp?: AxiosResponse<ApiResponse>) => void;
};

const handlerConfigs: ErrorHandlerConfig[] = [
    // 统一 Message 弹窗提示
    {
        errCodes: [
            // 用户未登录/不存在
            'USER_NO_EXIST',
            'USER_IS_INCONSISTENCY',

            // 应用加载错误
            'ENTERPRISE_NO_INSTALL_APPLICATION',
        ],
        handler(errCode, resp) {
            console.log(resp);
            const intlKey = errCode && errorKeyMaps[errCode.toLocaleLowerCase()];

            if (!intlKey) return;
            toast.error({ key: errCode, content: intl.get(intlKey) });
        },
    },
];

const handler: ErrorHandlerConfig['handler'] = (errCode, resp) => {
    // @ts-ignore
    const ignoreError = resp?.config?.$ignoreError as RequestFunctionOptions['$ignoreError'];
    const ignoreErrorMap = new Map<
        string,
        (code: string, resp?: AxiosResponse<unknown, any>) => void
    >();

    if (!Array.isArray(ignoreError)) {
        !!ignoreError && ignoreErrorMap.set(errCode!, noop);
    } else {
        ignoreError.forEach(item => {
            if (typeof item === 'string') {
                ignoreErrorMap.set(item, noop);
            } else {
                item.codes.forEach(code => {
                    ignoreErrorMap.set(code, item.handler);
                });
            }
        });
    }
    const ignoreErrorHandler = ignoreErrorMap.get(errCode!);

    if (isRequestSuccess(resp) || ignoreErrorHandler) {
        ignoreErrorHandler && ignoreErrorHandler(errCode!, resp);
        return;
    }

    const { status } = resp || {};
    // 网络超时
    if (status && [408, 504].includes(status)) {
        const networkTimeoutText = intl.get('common.message.error_network_timeout');
        // message.error(networkTimeoutText);
        toast.error({ key: errCode || status, content: networkTimeoutText });
        return;
    }

    const serverErrorText = intl.get('common.message.error_server_error');

    if (!errCode || !resp) {
        // eslint-disable-next-line
        console.warn('接口错误，且无任何响应，请通知后端处理');
        // message.error(serverErrorText);
        toast.error({ key: 'commonError', content: serverErrorText });
        return;
    }

    // 找到 handlerConfigs 中匹配到的第一个处理逻辑
    const config = handlerConfigs.find(item => item.errCodes.includes(errCode));

    if (!config) {
        // eslint-disable-next-line
        console.warn('未配置全局接口错误码处理逻辑，请确认是否已自行处理', resp);
        // message.error(serverErrorText);
        toast.error({ key: 'commonError', content: serverErrorText });
        return;
    }

    config.handler(errCode, resp);
};

export default handler;
