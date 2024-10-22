/**
 * 应用类型
 * @param web Web 应用
 */
type AppType = 'web';

/**
 * 请求参数通用 key 类型（通常用于 id, key 等字段）
 */
declare type ApiKey = string | number;

/**
 * 接口返回的通用数据结构类型
 */
declare type ApiResponse<T = any> = {
    data: T;
    status: 'Success' | 'Failed';
    request_id: string;
    error_code?: string;
    error_message?: string;
    detail_message?: string;
};

/**
 * API 基础类型定义
 */
declare type APISchema = Record<
    string,
    {
        request: Record<string, any> | void;
        response: Record<string, any> | any;
    }
>;

/**
 * 数据排序类型
 * @param asc 升序
 * @param desc 降序
 */
declare type SortType = 'asc' | 'desc';

/**
 * 数据排序属性
 */
declare type SortsProps = {
    property?: string | number;
    direction?: SortType;
};

/**
 * 查询接口请求参数数据结构
 */
declare type SearchRequestType = {
    /** 单页数据量 */
    pageSize?: number | null;

    /** 分页页码 */
    pageNumber?: number | null;

    /** 排序字段 */
    sorts?: SortsProps[];

    /** 查询 offset */
    offset?: number | null;

    /** 查询 limit 条数 */
    limit?: number | null;
};

/**
 * 查询接口响应数据结构
 */
declare type SearchResponseType<T = any[]> = {
    /** 单页数据量 */
    pageSize: number;
    /** 分页页码 */
    pageNumber: number;
    /** 数据总量 */
    total: number;
    /** 分页列表数据 */
    content: T;
};

/**
 * 将类型 T 中的部分字段映射为可选字段，其他字段保持原样
 */
declare type PartialOptional<T, K extends keyof T> = Omit<T, K> & {
    [P in K]?: T[P];
};

/**
 * 将类型 T 中的部分字段映射为必填字段，其他字段保持原样
 */
declare type RequiredOptional<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: T[P];
};

/**
 * 将下划线转为驼峰命名
 */
declare type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;
/**
 * 递归将对象中的所有属性名从下划线命名转换为驼峰命名
 */
declare type ConvertKeysToCamelCase<T> = {
    [K in keyof T as SnakeToCamelCase<Extract<K, string>>]: T[K] extends object
        ? ConvertKeysToCamelCase<T[K]>
        : T[K];
};
