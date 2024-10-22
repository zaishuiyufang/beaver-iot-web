import type { DataViewStore } from '../store';
import type { ConfigureType, IEntity, ViewConfigProps } from '../../typings';

export const useDynamic = () => {
    /**
     * 动态生成的每一项表单
     */
    const generateFormItem = (title: string, index: number) => {
        // TODO 根据entityData渲染配置
        return {
            $$type: 'dynamic',
            title,
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

    /**
     * 生成动态configure逻辑
     */
    const dynamicConfigure = (currentEntity: IEntity) => {
        const { entityValueAttribute, entityValueType } = currentEntity || {};

        if (['boolean', 'enum'].includes(entityValueType)) {
            const { enum: enumData } = entityValueAttribute || {};
            return Object.keys(enumData || {}).map((key, index) =>
                generateFormItem(`Appearance of ${key}`, index),
            );
        }

        return [generateFormItem(`Appearance`, 0)];
    };

    /** 动态渲染表单 */
    const updateDynamicForm = (
        value: ViewConfigProps,
        config: ConfigureType,
        state: DataViewStore,
    ) => {
        const { entityMap } = state || {};
        const { entity } = value || {};
        const entityValue = entity?.value;

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

    return {
        updateDynamicForm,
    };
};
