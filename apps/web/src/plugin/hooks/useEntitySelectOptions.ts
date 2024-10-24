import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { convertKeysToCamelCase } from '@milesight/shared/src/utils/tools';
// import {
//     dashboardAPI,
//     awaitWrap,
//     isRequestSuccess,
//     getResponseData,
//     type EntityData,
// } from '@/services/http';

interface EntityOptionProps {
    /**
     * 实体类型
     */
    entityType: EntityType;
    /**
     * 实体数据值类型
     */
    entityValueTypes: EntityValueType[];
    /**
     * 实体属性访问类型
     */
    accessMods: EntityAccessMod[];
}

function sleep(duration: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
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
            setLoading(true);
            setOptions([]);

            await sleep(1500);

            return [
                {
                    entity_id: 1,
                    device_name: '设备1',
                    integration_name: '云生态',
                    entity_key: 'key1',
                    entity_name: '选项1',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            busy: '1',
                        },
                    }),
                    entity_value_type: 'boolean',
                    access_mod: 'rw',
                },
                {
                    entity_id: 2,
                    device_name: '设备2',
                    integration_name: '云生态',
                    entity_key: 'key2',
                    entity_name: '选项2',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            free: '1',
                            busy: '1',
                            entertainment: '1',
                        },
                    }),
                    entity_value_type: 'enum',
                    access_mod: 'r',
                },
                {
                    entity_id: 3,
                    device_name: '设备3',
                    integration_name: '云生态',
                    entity_key: 'key3',
                    entity_name: '选项3',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '%',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            busy: '1',
                            free: '1',
                            entertainment: '1',
                        },
                    }),
                    entity_value_type: 'int',
                    access_mod: 'r',
                },
                {
                    entity_id: 5,
                    device_name: '设备 5',
                    integration_name: '云生态',
                    entity_key: 'key5',
                    entity_name: '选项5',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '%',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            busy: '1',
                            free: '1',
                            entertainment: '1',
                        },
                    }),
                    entity_value_type: 'number',
                    access_mod: 'r',
                },
                {
                    entity_id: 6,
                    device_name: '设备6',
                    integration_name: '云生态',
                    entity_key: 'key6',
                    entity_name: '选项6',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '%',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            busy: '1',
                            free: '1',
                            entertainment: '1',
                        },
                    }),
                    entity_value_type: 'string',
                    access_mod: 'r',
                },
                {
                    entity_id: 7,
                    device_name: '设备7',
                    integration_name: '云生态',
                    entity_key: 'key7',
                    entity_name: '选项7',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '%',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            busy: '1',
                            free: '1',
                            entertainment: '1',
                        },
                    }),
                    entity_value_type: 'boolean',
                    access_mod: 'w',
                },
                {
                    entity_id: 8,
                    device_name: '设备8',
                    integration_name: '云生态',
                    entity_key: 'key8',
                    entity_name: '选项8',
                    entity_value_attribute: JSON.stringify({
                        displayType: '',
                        unit: '%',
                        max: 10,
                        min: 1,
                        format: '',
                        coefficient: 1,
                        enum: {
                            busy: '1',
                            free: '1',
                            entertainment: '1',
                        },
                    }),
                    entity_value_type: 'float',
                    access_mod: 'r',
                },
            ] as EntityData[];
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
        const newOptions: EntityOptionType[] = (entityOptions || [])
            .filter(e => {
                /**
                 * 过滤实体数据值类型
                 */
                const isValidValueType =
                    !Array.isArray(entityValueTypes) ||
                    entityValueTypes.includes(e.entity_value_type as EntityValueType);

                /**
                 * 过滤实体属性访问类型
                 */
                const isValidAccessMod =
                    !Array.isArray(accessMods) ||
                    accessMods.includes(e.access_mod as EntityAccessMod);

                return isValidValueType && isValidAccessMod;
            })
            .map(e => {
                const entityValueAttribute = safeJsonParse(
                    e.entity_value_attribute,
                ) as EntityValueAttributeType;

                return {
                    label: e.entity_name,
                    value: e.entity_id,
                    description: [e.device_name, e.integration_name].join(', '),
                    rawData: {
                        ...convertKeysToCamelCase(e),
                        entityValueAttribute,
                    },
                };
            });

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
