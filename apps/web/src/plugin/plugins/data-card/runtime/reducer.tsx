import { useMemo } from 'react';
import useDataViewStore, { DataViewStore } from './store';
import { ConfigureType, ViewConfigProps } from '../typings';

interface IProps {
    value: ViewConfigProps;
    config: ConfigureType;
}
export const useReducer = ({ value, config }: IProps) => {
    const state = useDataViewStore();

    const stateToConfig = (value: ViewConfigProps, config: ConfigureType, state: DataViewStore) => {
        const { entityOptions, entityMap } = state || {};
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

        const [configProp] = configProps || [];
        const { components } = configProp || {};
        const [entity] = components || [];

        // 更新下拉选项
        if (entity && entityOptions) {
            entity.options = entityOptions;
        }

        return { ...config };
    };

    const dynamicConfigure = (currentEntity: any) => {
        const { valueAttribute, valueType } = currentEntity || {};

        if (['boolean', 'enum'].includes(valueType)) {
            const { enum: enumData } = valueAttribute || {};
            return Object.keys(enumData || {}).map((key, index) => generateFormItem(key, index));
        }

        return null;
    };
    const generateFormItem = (type: string, index: number) => {
        // TODO 根据entityData渲染配置
        return {
            $$type: 'dynamic',
            title: `Appearance of ${type}`,
            style: 'display: flex;margin-bottom: 20px;',
            theme: {
                default: {
                    class: 'first-component-icon-select',
                },
            },
            components: [
                {
                    type: 'iconSelect',
                    key: `${index}Icon`,
                    style: 'flex: 1;padding-right: 12px;',
                    componentProps: {
                        size: 'small',
                    },
                },
                {
                    type: 'iconColorSelect',
                    key: `${index}IconColor`,
                    style: 'flex: 1;',
                    componentProps: {
                        size: 'small',
                    },
                },
            ],
        };
    };

    const configure = useMemo(() => stateToConfig(value, config, state), [value, config, state]);

    return {
        configure,
    };
};
