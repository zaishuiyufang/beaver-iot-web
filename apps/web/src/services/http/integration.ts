import { client, apiPrefix, attachAPI } from './client';

export interface IntegrationAPISchema extends APISchema {
    /** 获取集成列表 */
    getList: {
        request: {
            /** 是否能添加设备 */
            device_addable: boolean;
            /** 是否能删除设备 */
            device_deleteable: boolean;
        };
        // TODO: 待调整补充
        response: {
            /** ID */
            integration_id: ApiKey;
            /** 名称 */
            name: string;
            /** 描述 */
            description: string;
            /** Logo URL */
            logo_url: string;
        };
    };

    /** 获取集成详情 */
    getDetail: {
        request: {
            id: ApiKey;
        };
        // TODO: 待补充
        response: unknown;
    };
}

/**
 * 集成相关 API 服务
 */
export default attachAPI<IntegrationAPISchema>(client, {
    apis: {
        getList: `POST ${apiPrefix}/integration/search`,
        getDetail: `GET ${apiPrefix}/integration/:id`,
    },
});
