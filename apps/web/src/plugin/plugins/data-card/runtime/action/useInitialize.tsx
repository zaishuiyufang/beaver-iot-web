import { useEffect } from 'react';
import { keyBy } from 'lodash-es';
import { convertKeysToCamelCase } from '@milesight/shared/src/utils/tools';
import type { EntityData } from '@/services/http';
import useDataViewStore from '../store';
import type { IEntity } from '../../typings';

// TODO 模拟数据，后续需要替换成真实请求
const mockData = (getDataUrl: string) => {
    const data: EntityData[] = [
        {
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
    return new Promise<EntityData[]>(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};

export const useInitialize = () => {
    const { clear } = useDataViewStore();

    /* 将实体数据转换为下拉选项 */
    const entityToOptions = (entityData: IEntity[]) => {
        return (entityData || []).map(entity => {
            // 实体名称、设备、来源集成
            const { entityKey, entityName, deviceName, integrationName } = entity || {};

            return {
                label: entityName,
                value: entityKey,
                description: [deviceName, integrationName].join(','),
            };
        });
    };
    const transformAttribute = (attribute: string) => {
        if (!attribute) return null;

        try {
            return JSON.parse(attribute) as Record<string, any>;
        } catch (e) {
            return null;
        }
    };
    /** 获取实体数据源 */
    const getEntityData = async (dataUrl: string) => {
        // TODO 请求数据 + 数据过滤
        const entityData = await mockData(dataUrl);

        const newEntityData: IEntity[] = entityData.map(entity => {
            const newEntity = convertKeysToCamelCase(entity);
            const { entityValueAttribute, ...rest } = newEntity || {};

            const attribute = transformAttribute(entityValueAttribute);
            if (!attribute) return rest;

            return {
                ...rest,
                entityValueAttribute: attribute,
            };
        });
        const options = entityToOptions(newEntityData);
        const entityMap = keyBy(newEntityData, 'entityKey');

        const { setState } = useDataViewStore;
        // 保存状态数据
        setState({ entityOptions: options, entityData: newEntityData, entityMap });
    };
    const run = () => {
        // TODO 请求数据
        const dataUrl = 'xxxx';
        getEntityData(dataUrl);
    };

    useEffect(() => {
        run();

        return () => {
            clear && clear();
        };
    }, []);
};
