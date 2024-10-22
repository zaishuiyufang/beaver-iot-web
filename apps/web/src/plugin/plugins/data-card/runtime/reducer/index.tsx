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

    /** config实时保存value */
    const updateConfigState = (value: ViewConfigProps, config: ConfigureType) => {
        config.config = value || {};

        return config;
    };
    /** 动态渲染表单 */
    const updateConfigForm = (
        value: ViewConfigProps,
        config: ConfigureType,
        state: DataViewStore,
    ) => {
        const { entityMap } = state || {};
        const { entity: entityValue } = value || {};

        // 获取当前选中实体
        const currentEntity = entityMap?.[entityValue];
        const { configProps } = config || {};

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

        return config;
    };
    /** 渲染实体下拉选项 */
    const updateEntityOptions = (
        _: ViewConfigProps,
        config: ConfigureType,
        state: DataViewStore,
    ) => {
        const { entityOptions } = state || {};

        const { configProps } = config || {};
        const [configProp] = configProps || [];
        const { components } = configProp || {};
        const [entity] = components || [];

        // 渲染下拉选项
        if (entity && entityOptions) {
            entity.options = entityOptions;
        }

        return config;
    };

    /** 生成新的configure */
    const configure = useMemo(() => {
        const ChainCallList = [updateConfigState, updateEntityOptions, updateConfigForm];

        const newConfig = ChainCallList.reduce((config, fn) => {
            return fn(value, cloneDeep(config), store);
        }, config);

        return { ...newConfig };
    }, [value, config, store]);

    return {
        configure,
    };
};
