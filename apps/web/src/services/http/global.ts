import { client, attachAPI } from './client';

export interface GlobalAPISchema extends APISchema {
    /** 登录 */
    oauthLogin: {
        request: {
            /** 用户名 */
            username: string;
            /** 密码 */
            password: string;
            /** 授权类型 */
            grant_type: 'password';
            /** Client ID */
            client_id: string;
            /** Client Secret */
            client_secret: string;
        };
        // TODO: 待补充
        response: any;
    };

    /** 刷新 Token */
    oauthRefresh: {
        request: {
            refresh_token: string;
            grant_type: 'refresh_token';
        };
        // TODO: 待补充
        response: any;
    };
}

export default attachAPI<GlobalAPISchema>(client, {
    apis: {
        oauthLogin: `POST /oauth/token`,
        oauthRefresh: `POST /oauth/token`,
    },
});
