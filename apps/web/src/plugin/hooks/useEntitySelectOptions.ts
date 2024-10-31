import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';

import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';

interface EntityOptionProps {
    /**
     * 实体类型
     */
    entityType?: EntityType;
    /**
     * 实体数据值类型
     */
    entityValueTypes?: EntityValueDataType[];
    /**
     * 实体属性访问类型
     */
    accessMods?: EntityAccessMode[];
}

function safeJsonParse(str: string) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

/**
 * 实体选项数据获取 hooks
 */
export function useEntitySelectOptions(props: EntityOptionProps) {
    const { entityType, entityValueTypes, accessMods } = props;

    const [options, setOptions] = useState<EntityOptionType[]>([]);
    const [loading, setLoading] = useState(false);

    const { run: getEntityOptions, data: entityOptions } = useRequest(
        async (keyword?: string) => {
            /**
             * 初始化加载状态
             */
            setOptions([]);
            setLoading(true);

            const [error, resp] = await awaitWrap(
                entityAPI.getList({
                    keyword,
                    entity_type: entityType,
                    // TODO 是否做分页请求
                    page_number: 1,
                    page_size: 999,
                }),
            );
            if (error || !isRequestSuccess(resp)) {
                setLoading(false);
                return;
            }

            const data = getResponseData(resp)!;
            return data?.content || [];
        },
        {
            manual: true,
            refreshDeps: [entityType],
            debounceWait: 300,
        },
    );

    /** 初始化执行 */
    useEffect(() => {
        getEntityOptions();
    }, [getEntityOptions]);

    /**
     * 根据实体数据转换为选项数据处理
     */
    useEffect(() => {
        const newEntityValueTypes = [...(entityValueTypes || [])];
        if (newEntityValueTypes.includes('ENUM')) {
            newEntityValueTypes.push('STRING');
        }
        let newOptions: EntityOptionType[] = (entityOptions || [])
            .filter(e => {
                /**
                 * 过滤实体数据值类型
                 */
                const isValidValueType =
                    !Array.isArray(entityValueTypes) ||
                    newEntityValueTypes.includes(e.entity_value_type as EntityValueDataType);
                /**
                 * 过滤实体属性访问类型
                 */
                const isValidAccessMod =
                    !Array.isArray(accessMods) ||
                    accessMods.includes(e.entity_access_mod as EntityAccessMode);

                return isValidValueType && isValidAccessMod;
            })
            .map(e => {
                const entityValueAttribute = safeJsonParse(
                    e.entity_value_attribute,
                ) as EntityValueAttributeType;

                return {
                    label: e.entity_name,
                    value: e.entity_id,
                    valueType: e.entity_value_type,
                    description: [e.device_name, e.integration_name].filter(Boolean).join(', '),
                    rawData: {
                        ...objectToCamelCase(e),
                        entityValueAttribute,
                    },
                };
            });
        if (entityValueTypes?.includes('ENUM')) {
            // 如果是枚举要过滤值类型是string并且有enum字段的
            newOptions = newOptions.filter((e: EntityOptionType) => {
                return e.valueType !== 'STRING' || e.rawData?.entityValueAttribute?.enum;
            });
        }
        setOptions(newOptions);
        setLoading(false);
    }, [entityOptions, entityValueTypes, accessMods]);

    return {
        loading,
        getEntityOptions,
        options,
        setOptions,
    };
}
