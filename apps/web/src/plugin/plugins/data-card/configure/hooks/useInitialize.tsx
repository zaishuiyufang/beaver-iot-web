import { useEffect } from 'react';
import { keyBy } from 'lodash-es';
import { entityToOptions } from '../helper';
import type { IConfig, IEntity } from '../../typings';

const mockData = (getDataUrl: string) => {
    const data: IEntity[] = [
        {
            id: '1',
            key: 'key1',
            name: '选项1',
            access_mod: 'rw',
            deviceName: '设备1',
            integration: '云生态',
            valueAttribute: {
                displayType: '',
                unit: '',
                max: 10,
                min: 1,
                format: '',
                coefficient: 1,
                enum: {
                    busy: '1',
                },
            },
            valueType: 'boolean',
        },
        {
            id: '2',
            key: 'key2',
            name: '选项2',
            access_mod: 'rw',
            deviceName: '设备2',
            integration: '云生态',
            valueAttribute: {
                displayType: '',
                unit: '',
                max: 10,
                min: 1,
                format: '',
                coefficient: 1,
                enum: {
                    busy: '1',
                    free: '1',
                    entertainment: '1',
                },
            },
            valueType: 'enum',
        },
    ];
    return new Promise<IEntity[]>(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
};

interface IProps {
    config: IConfig;
    setConfig: (config: IConfig) => void;
    entityMapRef: React.MutableRefObject<{ [key: string]: IEntity }>;
}
export const useInitialize = ({ config, setConfig, entityMapRef }: IProps) => {
    /** 获取实体配置 */
    const getEntityConfig = (config: IConfig) => {
        const [configProp] = config?.configProps || [];
        const { components } = configProp || {};
        const [entity] = components || [];
        return entity;
    };
    /** 获取实体数据源 */
    const getEntityData = async (dataUrl: string) => {
        // TODO 请求数据
        const entityData = await mockData(dataUrl);
        const options = entityToOptions(entityData);
        entityMapRef.current = keyBy(entityData, 'id');

        // 设置下拉选项
        const entityOptions = getEntityConfig(config);
        entityOptions.options = options;
        setConfig({ ...config });
    };
    useEffect(() => {
        // TODO 请求数据
        const dataUrl = 'xxxx';
        getEntityData(dataUrl);
    }, []);
};
