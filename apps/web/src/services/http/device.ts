/**
 * 设备相关 API 服务
 */
import { client, attachAPI } from './client';

/**
 * 设备详情定义
 */
export interface DeviceDetail {
    id: ApiKey;
    externalId: ApiKey;
    name: string;
    source: string;
    founder: string;
    createTime: number;
}

/**
 * 设备实体定义
 */
export interface DeviceEntity {
    id: ApiKey;
    name: string;
    type: string;
    dataType: string;
}

/**
 * 设备相关接口定义
 */
export interface DeviceAPISchema extends APISchema {
    /** 获取设备列表 */
    getDeviceList: {
        request: SearchRequestType;
        response: SearchResponseType<DeviceDetail>;
    };

    /** 获取设备详情 */
    getDeviceDetail: {
        request: {
            id: ApiKey;
        };
        response: DeviceDetail;
    };

    /** 获取设备实体 */
    getDeviceEntity: {
        request: {
            id: ApiKey;
        };
        response: DeviceEntity[];
    };
}

export default attachAPI<DeviceAPISchema>(client, {
    apis: {
        getDeviceList: `GET api/devices`,
        getDeviceDetail: `GET api/devices/:id`,
        getDeviceEntity: `GET api/devices/:id/entity`,
    },
});
