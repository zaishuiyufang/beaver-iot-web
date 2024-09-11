/**
 * 错误码黑名单
 *
 * 黑名单中的错误码由全局统一处理，业务中无需额外编写处理逻辑
 */
import type { AxiosResponse } from 'axios';
import intl from 'react-intl-universal';
import { toast } from '@milesight/shared/src/components';
import { errorKeyMaps } from '@milesight/shared/src/services/i18n';

type ErrorHandlerConfig = {
    /** 错误码集合 */
    errMsgs: string[];

    /** 处理函数 */
    handler: (errMsg: string, resp: AxiosResponse<ApiResponse>) => void;
};

const handlers: ErrorHandlerConfig[] = [
    // 统一 Message 弹窗提示
    {
        errMsgs: [
            // 用户未登录/不存在
            'USER_NO_EXIST',
            'USER_IS_INCONSISTENCY',

            // 应用加载错误
            'ENTERPRISE_NO_INSTALL_APPLICATION',
        ],
        handler(errMsg, resp) {
            console.log(resp);
            const intlKey = errMsg && errorKeyMaps[errMsg.toLocaleLowerCase()];

            if (!intlKey) return;
            /**
             * Todo: 文案未加载完成时如何处理？
             * 1. 增加全局 loading，必须等文案 ready 后才可进行接口请求，保证接口提示时能取到文案
             * 2. ??
             */
            toast.error(intl.get(intlKey));
        },
    },
];

export default handlers;
