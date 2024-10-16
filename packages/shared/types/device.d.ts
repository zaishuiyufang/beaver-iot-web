/**
 * 设备数据模型
 */
declare interface DeviceSchema {
    /** 设备 ID */
    id: ApiKey;

    /** 设备 Key */
    key: ApiKey;

    /** 设备名称 */
    name: string;

    /** 来源集成 ID */
    integration: string;

    /** 集成外部 ID */
    externalId: ApiKey;

    /** 额外数据 */
    additionalData?: any;

    /** 创建时间 */
    createAt: number;

    /** 更新时间 */
    updateAt: number;
}
