import { useMemo } from 'react';
import { cloneDeep } from 'lodash-es';
import useDataViewStore, { DataViewStore } from '../store';
import { useDynamic } from './useDynamic';
import type { ConfigureType, ViewConfigProps } from '../../typings';

interface IProps {
    value: ViewConfigProps;
    config: ConfigureType;
}
export const useReducer = ({ value, config }: IProps) => {
    const store = useDataViewStore();
    const { dynamicConfigure } = useDynamic();

    /** 数据转化为配置 */
    const stateToConfig = (value: ViewConfigProps, config: ConfigureType, state: DataViewStore) => {
        const { entityOptions, entityMap } = state || {};
        const { entity: entityValue } = value || {};
        // 获取当前选中实体
        const currentEntity = entityMap?.[entityValue];
        const { configProps } = config || {};

        // 实时渲染变化
        config.config = value || {};

        if (currentEntity) {
            // 渲染动态表单
            const result = dynamicConfigure(currentEntity);
            if (result) {
                const newConfigProps = [
                    ...configProps.filter((item: any) => item.$$type !== 'dynamic'),
                    ...result,
                ];
                config.configProps = newConfigProps;
            }
        }

        const [configProp] = configProps || [];
        const { components } = configProp || {};
        const [entity] = components || [];

        // 渲染下拉选项
        if (entity && entityOptions) {
            entity.options = entityOptions;
        }

        return { ...config };
    };

    const configure = useMemo(
        () => stateToConfig(value, cloneDeep(config), store),
        [value, config, store],
    );

    return {
        configure,
    };
};
