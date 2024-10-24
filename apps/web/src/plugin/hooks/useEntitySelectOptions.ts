import { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
// import {
//     dashboardAPI,
//     awaitWrap,
//     isRequestSuccess,
//     getResponseData,
//     type EntityData,
// } from '@/services/http';

interface EntityOptionProps {
    entityType: EntityType;
    entityValueTypes: EntityValueType[];
}

function sleep(duration: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * 实体选项数据获取 hooks
 */
export function useEntitySelectOptions(props: EntityOptionProps) {
    const { entityType, entityValueTypes } = props;

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
                },
            ];
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
                if (!Array.isArray(entityValueTypes)) {
                    return true;
                }

                return entityValueTypes.includes(e.entity_value_type as EntityValueType);
            })
            .map(e => {
                return {
                    label: e.entity_name,
                    value: e.entity_id,
                    description: [e.device_name, e.integration_name].join(', '),
                    rawData: {
                        ...e,
                    },
                };
            });

        setOptions(newOptions);
        setLoading(false);
    }, [entityOptions, entityValueTypes]);

    return {
        loading,
        getEntityOptions,
        options,
        setOptions,
    };
}
