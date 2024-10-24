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
                    entity_name: `entity name ${keyword || ''}`,
                    device_name: 'Device name',
                    integration_name: 'Integration name',
                    entity_value_type: 'boolean',
                },
                {
                    entity_id: 2,
                    entity_name: `entity name 2`,
                    device_name: 'Device name 2',
                    integration_name: 'Integration name 2',
                    entity_value_type: 'string',
                },
                {
                    entity_id: 3,
                    entity_name: `entity name 3`,
                    device_name: 'Device name 3',
                    integration_name: 'Integration name 3',
                    entity_value_type: 'number',
                },
                {
                    entity_id: 5,
                    entity_name: `entity name 5`,
                    device_name: 'Device name 5',
                    integration_name: 'Integration name 5',
                    entity_value_type: 'float',
                },
                {
                    entity_id: 6,
                    entity_name: `entity name 6`,
                    device_name: 'Device name 6',
                    integration_name: 'Integration name 6',
                    entity_value_type: 'boolean',
                },
                {
                    entity_id: 7,
                    entity_name: `entity name 7`,
                    device_name: 'Device name 7',
                    integration_name: 'Integration name 7',
                    entity_value_type: 'boolean',
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
                    ...e,
                    label: e.entity_name,
                    value: e.entity_id,
                    description: [e.device_name, e.integration_name].join(', '),
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
