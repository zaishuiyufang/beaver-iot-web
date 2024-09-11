/**
 * 注意：当前文件仅为示例，可根据业务随意调整
 */
import { client, attachAPI } from './client';

interface UserAPISchema extends APISchema {
    /** 根据 id 获取用户 */
    getUser: {
        request: {
            id: number;
        };
        response: {
            avatar: string;
            id: number;
            name: string;
        };
    };

    /** 获取当前登录用户 */
    getLoginUser: {
        request: void;
        response: {
            id: number;
            name: string;
            avatar: string;
        };
    };

    /** 创建新用户 */
    createUser: {
        request: {
            avatar: string;
            name: string;
            enterpriseId: number;
        };
        response: {
            avatar: string;
            id: number;
            name: string;
        };
    };

    /** 下载资源 */
    download: {
        request: {
            id: number;
        };
        response: any;
    };
}

export default attachAPI<UserAPISchema>(client, {
    onError(error) {
        // Todo: apis 统一错误处理
        return error;
    },

    onResponse(resp) {
        // Todo: apis 统一响应处理
        return resp;
    },

    // 支持 3 种配置方式，可灵活选择
    apis: {
        // 字符串配置
        getUser: 'GET api/user/:id',
        getLoginUser: 'GET api/user/current',

        // 对象配置
        createUser: {
            method: 'POST',
            path: 'api/user/:enterpriseId',
            // 特殊配置
            headers: { 'x-abc': 'xxx' },
        },

        // 函数配置
        download: async params => {
            const resp = await client.request({
                url: 'http://xxx.yeastar.com',
                method: 'GET',
                params,
                headers: {
                    enterpriseId: 'xxx',
                },
                responseType: 'blob',
            });
            const result = resp.data.data;
            // ...
            return result;
        },
    },
});
