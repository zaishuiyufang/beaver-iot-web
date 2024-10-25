import { client, attachAPI, API_PREFIX } from './client';

export interface IntegrationAPISchema extends APISchema {
    /** 获取集成列表 */
    getList: {
        request: void | {
            /** 是否能添加设备 */
            device_addable?: boolean;
            /** 是否能删除设备 */
            device_deletable?: boolean;
        };
        response: {
            /** ID */
            id: ApiKey;
            /** 图标 */
            icon: string;
            /** 名称 */
            name: string;
            /** 描述 */
            description: string;
            /** 添加设备的实体 Key */
            add_device_service_key: ApiKey;
            /** 设备数量 */
            device_count: number;
            /** 实体数量 */
            entity_count: number;
        }[];
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
        getList: `POST ${API_PREFIX}/integration/search`,
        getDetail: `GET ${API_PREFIX}/integration/:id`,
    },
});
