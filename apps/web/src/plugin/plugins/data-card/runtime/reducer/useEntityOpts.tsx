import type { DataViewStore } from '../store';
import type { ConfigureType, ViewConfigProps } from '../../typings';

export const useEntityOpts = () => {
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

    return {
        updateEntityOptions,
    };
};
