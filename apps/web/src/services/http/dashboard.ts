/**
 * dashboard 相关 API 服务
 */
import { client, attachAPI } from './client';

/**
 * 实体历史数据值
 */
export interface EntityHistoryData {
    /** 日期 */
    timestamp: number;
    value: any;
}

/**
 * dashboard 相关接口定义
 */
export interface dashboardAPISchema extends APISchema {
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
    /** 获取实体历史数据 */
    getEntityHistorySearch: {
        request: SearchRequestType & {
            entity_id: string;
            start_timestamp: number;
            end_timestamp: number;
        };
        response: EntityHistoryData[];
    };
}

export default attachAPI<dashboardAPISchema>(client, {
    apis: {
        getEntityStatus: `GET api/entity/:id/status`,
        getEntityHistorySearch: `POST api/entity/history/search`,
    },
});
