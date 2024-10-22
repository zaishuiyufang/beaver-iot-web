import { client, attachAPI, API_PREFIX } from './client';

export interface EntityAPISchema extends APISchema {
    /** 获取实体列表 */
    getList: {
        request: SearchRequestType & {
            /** 搜索关键字 */
            keyword?: string;
            /** 实体类型 */
            entity_type?: EntitySchema['type'];
        };
        response: SearchResponseType<{
            /** 设备名称 */
            device_name: string;
            /** 集成名称 */
            integration_name: string;
            /** 实体 Key */
            entity_key: ApiKey;
            /** 实体名称 */
            entity_name: string;
            /** 实体值属性 JSON 字符串 */
            entity_value_attribute: string;
            /** 实体值数据类型 */
            entity_value_type: EntityValueDataType;
        }>;
    };

    /** 获取历史数据 */
    getHistory: {
        request: SearchRequestType & {
            /** 实体 ID */
            entity_id: ApiKey;
            /** 开始时间戳，单位 ms */
            start_timestamp: number;
            /** 结束时间戳，单位 ms */
            end_timestamp: number;
            /** 聚合类型，TODO: 枚举值？ */
            aggregate_type: string;
        };
        // TODO: 待补充
        response: SearchResponseType<{
            history_data: {
                value: unknown;
                timestamp: number;
            }[];
        }>;
    };

    /** 获取元数据 */
    getMeta: {
        request: {
            id: ApiKey;
        };
        // TODO: 待补充
        response: unknown;
    };

    /** 获取实体 ApiDoc 表单数据 */
    getApiDoc: {
        request: {
            entity_id_list: ApiKey[];
        };
        response: unknown;
    };

    /** 更新属性类型实体 */
    updateProperty: {
        // TODO: 待补充
        request: {
            /** 实体 ID */
            entity_id: ApiKey;
            exchange: Record<string, any>;
        };
        // TODO: 待补充
        response: unknown;
    };

    /** 调用服务类型实体 */
    callService: {
        // TODO: 待补充
        request: {
            /** 实体 ID */
            entity_id: ApiKey;
            exchange: Record<string, any>;
        };
        // TODO: 待补充
        response: unknown;
    };
}

/**
 * 实体相关 API 服务
 */
export default attachAPI<EntityAPISchema>(client, {
    apis: {
        getList: `POST ${API_PREFIX}/entity/search`,
        getHistory: `POST ${API_PREFIX}/entity/history/search`,
        getMeta: `GET ${API_PREFIX}/entity/:id/meta`,
        getApiDoc: `POST ${API_PREFIX}/entity/form`,
        updateProperty: `POST ${API_PREFIX}/entity/property/update`,
        callService: `POST ${API_PREFIX}/entity/service/call`,
    },
});
