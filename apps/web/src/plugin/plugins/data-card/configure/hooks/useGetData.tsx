import { useEffect, useMemo, useRef, useState } from 'react';

interface IEntity {
    id: string;
    key: string;
    name: string;
    type: string;
    access_mod: string;
    value_attribute: any;
    value_type: string;
    label?: string;
    value?: string;
}
const mockData = (getDataUrl: string) => {
    const data: IEntity[] = [
        {
            id: '1',
            key: 'key',
            name: '选项1',
            type: 'service',
            access_mod: 'rw',
            value_attribute: [
                {
                    key: 'key',
                    value: 'value',
                },
            ],
            value_type: 'enum',
        },
    ];
    return new Promise<IEntity[]>(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};

export const useGetData = ({ config, value }: { config: any; value: any }) => {
    const { entity } = value || {};
    const [customConfig, setCustomConfig] = useState(config);
    const entityMapRef = useRef<Record<string, IEntity>>({});

    const getEntity = (config: any) => {
        const [configProp] = config?.configProps || [];
        const { components } = configProp || {};
        const [entity] = components || [];
        return entity;
    };
    const dealData = (data: IEntity[]) => {
        return data.reduce(
            (result, entity) => {
                const { label, value, key, name } = entity || {};

                const k = label ?? name;
                const v = value ?? key;
                const newEntity = {
                    ...entity,
                    label: k,
                    value: v,
                };

                const { entityMap, entityData } = result || {};
                entityMap[v] = newEntity;
                entityData.push(newEntity);
                return result;
            },
            {
                entityMap: {} as Record<string, IEntity>,
                entityData: [] as IEntity[],
            },
        );
    };
    const getData = async (dataUrl: string) => {
        // TODO 请求数据
        const data = await mockData(dataUrl);

        const { entityMap, entityData } = dealData(data);
        entityMapRef.current = entityMap;

        // 设置下拉选项
        const entityOptions = getEntity(config);
        entityOptions.options = entityData;
        setCustomConfig({ ...config });
    };

    useEffect(() => {
        const dataUrl = 'xxxx';
        getData(dataUrl);
    }, []);
    useEffect(() => {
        setCustomConfig(config);
    }, [config]);

    const renderConfig = (entityData: IEntity) => {
        const { configProps } = config || {};
        // TODO 根据entityData渲染配置
        configProps.push({
            title: 'Appearance of Busy',
            style: 'display: flex;margin-top:28px;',
            theme: {
                default: {
                    class: 'first-component-icon-select',
                },
            },
            components: [
                {
                    type: 'iconSelect',
                    key: 'busyIcon',
                    style: 'flex: 1;',
                    componentProps: {
                        size: 'small',
                    },
                },
                {
                    type: 'iconColorSelect',
                    key: 'busyIconColor',
                    style: 'flex: 1;',
                    defaultValue: '#9B9B9B',
                    componentProps: {
                        size: 'small',
                    },
                },
            ],
        });
        setCustomConfig({ ...config });
    };
    useEffect(() => {
        if (!entity) return;

        const entityMap = entityMapRef.current;
        const entityData = entityMap[entity] || [];
        renderConfig(entityData);
    }, [entity]);

    return {
        customConfig,
    };
};
