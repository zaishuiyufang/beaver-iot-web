import { useEffect } from 'react';
import { keyBy } from 'lodash-es';
import useChartStore from './store';
import type { ViewConfigProps, ConfigureType } from '../typings';

type IEntity = any;
// TODO 模拟数据，后续需要替换成真实请求
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
    value: ViewConfigProps;
    config: ConfigureType;
}
export const useAction = ({ value, config }: IProps) => {
    const { clear } = useChartStore();

    /* 将实体数据转换为下拉选项 */
    const entityToOptions = (entityData: any[]) => {
        return (entityData || []).map(entity => {
            // 实体名称、设备、来源集成
            const { id, name, deviceName, integration } = entity || {};

            return {
                label: name,
                value: id,
                description: [deviceName, integration].join(','),
            };
        });
    };
    /** 获取实体数据源 */
    const getEntityData = async (dataUrl: string) => {
        // TODO 请求数据 + 数据过滤
        const entityData = await mockData(dataUrl);
        const options = entityToOptions(entityData);
        const entityMap = keyBy(entityData, 'id');

        const { setState } = useChartStore;
        // 保存状态数据
        setState({ entityOptions: options, entityData, entityMap });
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
