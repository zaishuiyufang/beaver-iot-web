/**
 * Http 请求数据类型
 */
declare type RequestContentType =
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
    | string;

/**
 * Http 请求方法
 */
declare type RequestMethodType =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE';

/** OpenAPI 配置中的数据类型 */
declare type OpenApiDataType = 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';

/**
 * OpenAPI 配置中的参数位置
 * @param query 路径中，以 query 形式传参
 * @param header 请求头中
 * @param path 路径中
 * @param formData 表单数据中
 */
declare type OpenApiParamLocationType = 'query' | 'header' | 'path' | 'formData';

/** OpenAPI 参数字段定义 */
declare type OpenApiFieldType = {
    /** 名称 */
    name: string;
    /** 数据类型 */
    type?: OpenApiDataType;
    /** 引用路径 */
    $ref?: string;
    /** 描述 */
    description?: string;
    /** 枚举值 */
    enum?: string[];
    /** 格式 */
    format?: string;
    /** 数组中子参数数据定义 */
    items?: {
        /** 传参类型 */
        type?: OpenApiDataType;
        /** 描述 */
        description?: string;
        /** 枚举值 */
        enum?: string[];
        /** 各参数数据描述 */
        properties?: Record<string, OpenApiFieldType>;
        /** 必填参数 */
        required?: boolean | string[];
    };
    /** 是否必填 */
    required?: boolean | string[];
    // 以下字段为非标准字段，暂不做处理
    // default?: string | boolean;
    // minimum?: number;
    // maximum?: number;
    // minLength?: number;
    // maxLength?: number;
    // pattern?: string;
    // 'x-apifox'?: {
    //     /** 枚举值描述 */
    //     enumDescriptions: Record<string, string>;
    // };
};

/** OpenApi 规范类型定义 */
declare type OpenApiSpec = {
    /** OpenApi 版本 */
    openapi: string;
    /** 基本信息 */
    info: {
        title: string;
        version: string;
        description: string;
    };
    /** 分类标签 */
    tags: {
        name: string;
        description?: string;
    }[];
    /** 接口路径集合 */
    paths: Record<
        string,
        Partial<
            Record<
                Lowercase<RequestMethodType>,
                {
                    /** 接口概要 */
                    summary: string;
                    /** 接口描述 */
                    description: string;
                    /** 分类标签 */
                    tags: string[];
                    /** 请求参数（包括路径参数和请求头参数） */
                    parameters?: {
                        /** 参数名 */
                        name: string;
                        /** 参数位置 */
                        in: OpenApiParamLocationType;
                        /** 描述 */
                        description?: string;
                        /** 是否必填 */
                        required?: boolean | string[];
                        schema: {
                            /** 类型 */
                            type: OpenApiDataType;
                            /** 格式 */
                            // format?: string;
                        };
                    }[];
                    /** 请求体 */
                    requestBody?: {
                        content: Partial<
                            Record<
                                RequestContentType,
                                {
                                    schema: {
                                        /** 引用路径 */
                                        $ref?: string;
                                        /** 传参类型 */
                                        type?: OpenApiDataType;
                                        /** 描述 */
                                        description?: string;
                                        /** 各参数数据描述 */
                                        properties?: Record<string, OpenApiFieldType>;
                                        /** 必填参数 */
                                        required?: boolean | string[];
                                        /**
                                         * 参数在 ApiFox 中的渲染顺序
                                         *
                                         * 注意：在 requestBody 中，数组项为引用值，引用 `x-apifox-refs` 的配置数据
                                         */
                                        // 'x-apifox-orders'?: string[];
                                        // /** 内部引用配置 */
                                        // 'x-apifox-refs'?: {
                                        //     [key: string]: {
                                        //         $ref?: string;
                                        //         type?: string;
                                        //         description?: string;
                                        //     };
                                        // };
                                    };
                                }
                            >
                        >;
                    };
                }
            >
        >
    >;
    /** 全局引用配置 */
    components?: {
        schemas: Record<
            string,
            {
                /** 传参类型 */
                type: OpenApiDataType;
                /** 各参数数据定义 */
                properties: Record<string, OpenApiFieldType>;
                /** 必填参数 */
                required?: boolean | string[];
            }
        >;
    };

    /** 服务器配置 */
    servers?: {
        url: string;
        description?: string;
    }[];
};
