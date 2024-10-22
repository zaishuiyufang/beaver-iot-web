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

/** 实体数据 */
export interface EntityData {
    /** 设备名称 */
    device_name: string;
    /** 集成名称 */
    integration_name: string;
    /** 实体key */
    entity_key: string;
    /** 实体名称 */
    entity_name: string;
    /** 实体值属性 */
    entity_value_attribute: string;
    /** 实体值类型 */
    entity_value_type: string;
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
    /** 获取实体列表 */
    getEntityList: {
        request: {
            /** 搜索字段 */
            keyword?: string;
            /** 实体类型 */
            entity_type?: string;
            /** 每页条数 */
            page_size: number;
            /** 页码 */
            page_number: number;
        };
        response: EntityData[];
    };
    /** 更新属性类型的实体值 */
    updatePropertyEntity: {
        request: {
            entity_id: string;
            exchange: Record<string, any>;
        };
        response: void;
    };
}

export default attachAPI<dashboardAPISchema>(client, {
    apis: {
        getEntityStatus: `GET api/entity/:id/status`,
        getEntityHistorySearch: `POST api/entity/history/search`,
        getEntityList: `POST api/entity/search`,
        updatePropertyEntity: `POST api/entity/property/update`,
    },
});
