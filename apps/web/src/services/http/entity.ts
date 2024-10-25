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
        response: SearchResponseType<EntityData[]>;
    };

    /** 获取实体数据 */
    getDetail: {
        request: {
            id: ApiKey;
        };
        response: {
            update_at: number;
            // TODO: 待补充
            value: unknown;
        };
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
        };
        // TODO: 待补充
        response: SearchResponseType<
            {
                value: unknown;
                timestamp: number;
            }[]
        >;
    };

    /** 获取聚合历史数据 */
    getAggregateHistory: {
        request: {
            /** 实体 ID */
            entity_id: ApiKey;
            /** 开始时间戳，单位 ms */
            start_timestamp: number;
            /** 结束时间戳，单位 ms */
            end_timestamp: number;
            /** 聚合类型 */
            aggregate_type: DataAggregateType;
        };
        response: SearchResponseType<
            {
                /** TODO: 待补充，只有在 LAST, MIN, MAX, AVG, SUM 出现 */
                value: unknown;
                count_result: {
                    value: unknown;
                    /** 数量 */
                    count: number;
                }[];
            }[]
        >;
    };

    /** 获取元数据 */
    getMeta: {
        request: {
            id: ApiKey;
        };
        response: {
            entity_key: ApiKey;
            entity_name: string;
            entity_value_attribute: string;
            entity_value_type: EntityValueDataType;
        };
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

    /** 获取实体当前数据 */
    getEntityStatus: {
        request: {
            id: ApiKey;
        };
        response: {
            value: any;
            updated_at: number;
        };
    };
}

/**
 * 实体相关 API 服务
 */
export default attachAPI<EntityAPISchema>(client, {
    apis: {
        getList: `POST ${API_PREFIX}/entity/search`,
        getDetail: `GET ${API_PREFIX}/entity/:id/status`,
        getHistory: `POST ${API_PREFIX}/entity/history/search`,
        getAggregateHistory: `POST ${API_PREFIX}/entity/history/aggregate`,
        getMeta: `GET ${API_PREFIX}/entity/:id/meta`,
        getApiDoc: `POST ${API_PREFIX}/entity/form`,
        updateProperty: `POST ${API_PREFIX}/entity/property/update`,
        callService: `POST ${API_PREFIX}/entity/service/call`,
        getEntityStatus: `GET ${API_PREFIX}/entity/:id/status`,
    },
});
