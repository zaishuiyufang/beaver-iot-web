/** 支持的 Lora 协议类型 */
declare type LoraClassType = 'A' | 'B' | 'C';

/**
 * 设备类型
 * @param SUB_DEVICE 子设备
 * @param COMMON 普通直连设备
 * @param GATEWAY 网关
 */
declare type DeviceType = 'SUB_DEVICE' | 'COMMON' | 'GATEWAY';

/** 通讯技术协议 */
declare type CommunicationTechnologyType = 'LORA' | 'NB_IOT' | 'CAT_1' | 'WIFI';

/**
 * 产品物模型基础信息类型
 */
declare type ProductBasicInfoType = {
    /** 产品名称 */
    name: string;

    /** 备注 */
    remark: string;

    /** 图片地址（该字段不支持 base64） */
    photoUrl: string;

    /** 设备类型 */
    deviceType: DeviceType;

    /** 网关类型(仅子设备和网关需要指定) */
    gatewayType?: 'LORA';

    /** sn 长度，通常为 12 / 16 */
    snLength: number;

    /** sn 前缀 */
    snIdentification: string;

    /** 产品 SN 附加位 */
    snAdditionalBits: string;

    /** 网关/直连设备和云平台之间的通信协议 */
    communicationProtocol: 'MQTT';

    /** 支持的 Lora 协议类型 */
    supportLoraClassTypes?: LoraClassType[];

    /** 默认 Lora 协议类型 */
    defaultLoraClassType?: LoraClassType;

    /** 其他设置 */
    extraOptions?: {
        /** 是否将长连接断开视为离线事件 (默认true) */
        disconnectAsOffline?: boolean;
        /** 是否启用离线状态定时检查 (网关默认false, 其他设备默认true) */
        scheduleOfflineCheck?: boolean;
        /** 离线状态定时检查周期 (默认86400) */
        scheduleOfflinePeriod?: number;
        /** 是否在下发前需要唤醒 (默认false) */
        wakeUpBeforePublish?: boolean;
        /** 是否允许同时建立多个连接 (默认false) */
        multipleConnection?: boolean;
        /** 通讯技术协议 */
        communicationTechnologyType?: CommunicationTechnologyType[];
        /** 是否支持 TSL Config 更新至 RPS (默认false) */
        tslConfigUpdateToRps?: boolean;
    };
};

/**
 * 设备访问模式
 * @param R 只读
 * @param W 只写
 * @param RW 读写
 */
declare type ProductAccessModeType = 'R' | 'W' | 'RW';

/**
 * 物模型属性数据类型
 */
declare type ProductPropertyDataType = 'BYTE' | 'INT' | 'LONG' | 'FLOAT' | 'DOUBLE' | 'DATE' | 'BOOL' | 'ENUM' | 'STRING' | 'STRUCT' | 'ARRAY';;

/**
 * 表单定义
 */
declare interface TslPropertyFormSpec {
    /**
     * 分组id
     */
    groupId?: string;
    /**
     * 分组名称
     * (备注: 为了前端使用便利, 冗余存储)
     */
    groupName?: string;
    /**
     * 下发失败时是否回滚表单, 默认为true
     */
    rollbackOnFailure?: boolean;
    /**
     * 是否在基本信息中可见, 默认为false
     */
    visibleInBasicInfo?: boolean;
    /**
     * 是否在参数设置中可见, 默认为false
     */
    visibleInParameterSettings?: boolean;
}

/**
 * 产品物模型 Property 类型
 */
declare type ProductPropertyType = {
    /** 属性id, 物模型内唯一（包含 event 和 service） */
    id: string;

    /** json中的字段key */
    propertyKey: string;

    /** 是否隐藏 */
    hidden: boolean;

    /** 属性名 */
    name: string;

    /** 描述 */
    description: string;

    /** 访问模式 */
    accessMode: ProductAccessModeType;

    /** 表单定义 */
    formSpec?: TslPropertyFormSpec;

    dataSpec: {
        /** 数据类型 */
        dataType: ProductPropertyDataType;
        /** 元素数据类型, 仅数组有该属性 */
        elementDataType: ProductPropertyDataType;
        /** 父节点 id, array和struct数据结构特有 */
        parentId: string;
        /** 默认值，统一用字符串 */
        defaultValue: string;
        /** 单位显示名称 */
        unitName: string;
        /** 保留几位小数 */
        fractionDigits: number;
        /** 系数 */
        coefficient: number;
        /** 步长, 数值的最小间隔, 例如步长为2时, 合法值为0℃、2℃、4℃、6℃、8℃等 */
        step: number;
        /** 编码 */
        encoding: string;
        /**
         * 枚举映射
         * @deprecated
         */
        mapping: Record<string, string>;
        /** 枚举映射 */
        mappings: Record<string, string>[];
        /** 校验规则, 限制输入参数 */
        validator: {
            /** 最小值 */
            min: number;
            /** 最大值 */
            max: number;
            /** 数组/字符串大小 */
            minSize: number;
            maxSize: number;
            /** 必填(即不能为空) */
            required: boolean;
            /** 正则表达式 */
            pattern: string;
        };
    };
};

/**
 * 产品物模型 Event 类型
 */
declare type ProductEventType = {
    /** 事件id */
    id: string;
    /** 事件名称 */
    name: string;
    /** 事件描述 */
    description: string;
    /**
     * 事件类型
     * @param INFO 通知
     * @param WARN 警告
     * @param ERROR 错误
     */
    type: 'INFO' | 'WARN' | 'ERROR';

    /** 上报参数，结构同 properties */
    outputs: Partial<Omit<ProductPropertyType, 'accessMode'> & {
        /** 引用已有的 property id, 表示该参数定义与目标属性相同 */
        ref: string;
    }>[];
};

/**
 * 产品物模型 Service 类型
 */
declare type ProductServiceType = {
    /** 服务id */
    id: string;
    /** 服务名称 */
    name: string;
    /** 服务描述 */
    description: string;
    /** 是否隐藏，若为 true 则前端不展示 */
    hidden: boolean;
    /**
     * 调用类型
     * @param SYNC 同步
     * @param ASYNC 异步
     */
    callType: 'SYNC' | 'ASYNC';
    /** 下发参数, 结构同 properties */
    inputs: Partial<
        Omit<ProductPropertyType, 'accessMode'> & {
            /** 引用已有的 property id, 表示该参数定义与目标属性相同 */
            ref: string;
        }
    >[];
    /** 上报参数, 结构同 properties */
    outputs: ProductServiceType['inputs'];
};

/**
 * 产品设备配置文件类型定义
 */
declare type ProductProfileType = {
    /** 版本号 */
    version: string;
    /** 类型 */
    type: string;
    /** 具体配置 */
    values?: {
        key: string;
        value: string;
    }[];
    /** 前端表单配置 */
    form?: any;
};

/**
 * 产品物模型定义
 */
declare type ProductThingSpecType = {
    /** 版本号 */
    version: string;
    /** 属性 */
    properties?: ProductPropertyType[];
    /** 事件 */
    events?: ProductEventType[];
    /** 服务 */
    services?: ProductServiceType[];
};

/**
 * 产品多语言配置定义
 */
declare type ProductI18nType = {
    /** 区域，如 `en` */
    locale: string;
    /** 文案 key */
    code: string;
    /** 文案 value */
    value: string;
};

/**
 * 编解码定义
 */
declare type ProductDefinitionType = {
    /** id */
    id: string;
    /** 通道 */
    channel: number;
    /** 类型 */
    type: number;
    /** 开始字节位 */
    startByte?: number;
    /** 结束字节位 */
    endByte?: number;
    /** 开始比特位 */
    startBit?: number;
    /** 结束比特位 */
    endBit?: number;
    /** 数据类型 */
    dataType: string;
    /** 异常值 */
    exceptionValues?: Record<string, any>;
    /** 固定值 */
    fixedValue?: number;
};

/**
 * 解析器类型
 */
declare type ProductParserType = {
    /** 解码器 */
    decoder: {
        definitions: ProductDefinitionType[];
    };
    /** 编码器 */
    encoder: {
        definitions: ProductDefinitionType[];
    };
    thingSpecificationSupports: Record<string, any>[];
    type: 'IPSO';
};

/**
 * 产品描述文件完整类型定义
 */
declare type ProductJsonSpecType = {
    /** 指定 json schema */
    $schema?: string;

    /** 描述文件规范的版本号 */
    manifestVersion?: string;

    /**
     * 产品型号，标识当前文件关联的产品（用于 i18n key 时转为小写下划线）
     */
    productModel?: string;

    /** 产品基础信息 */
    productInformation?: ProductBasicInfoType;

    /** 产品物模型 */
    thingSpecifications?: ProductThingSpecType[];

    /** 设备配置文件 */
    configurationProfiles?: ProductProfileType[];

    /** 解析器 */
    parser?: ProductParserType;

    /** 国际化多语言配置 */
    i18n?: ProductI18nType[];
};
