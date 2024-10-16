/**
 * 实体访问模式
 * @param R 只读
 * @param W 只写
 * @param RW 读写
 */
declare type EntityAccessMode = 'R' | 'W' | 'RW';

/**
 * 实体类型
 * @param service 服务
 * @param property 属性
 * @param event 事件
 */
declare type EntityType = 'service' | 'property' | 'event';

/**
 * 物模型属性数据类型
 */
declare type EntityValueDataType = 'STRING' | 'INT' | 'FLOAT' | 'BOOLEAN' | 'BINARY' | 'OBJECT';

/**
 * 实体数据模型
 */
declare interface EntitySchema {
    /** 实体 ID */
    id: ApiKey;

    /** 实体 Key */
    key: ApiKey;

    /** 实体名称 */
    name: string;

    /** 实体类型 */
    type: EntityType;

    /** 访问模式 */
    accessMode: EntityAccessMode;

    /** 是否同步调用服务 */
    syncCall: boolean;

    /** 父节点 ID */
    parent: ApiKey;

    /** 隶属对象 */
    attachTarget: string;

    /** 隶属对象 ID */
    attachTargetId: ApiKey;

    /** 实体值属性 */
    valueAttribute: any;

    /** 实体值类型 */
    valueType: string;

    /** 创建时间 */
    createAt: number;

    /** 更新时间 */
    updateAt: number;
}
