import type { IEntity } from '../../typings';

export const useDynamic = () => {
    /**
     * 生成动态configure逻辑
     */
    const dynamicConfigure = (currentEntity: IEntity) => {
        const { entityValueAttribute, entityValueType } = currentEntity || {};

        if (['boolean', 'enum'].includes(entityValueType)) {
            const { enum: enumData } = entityValueAttribute || {};
            return Object.keys(enumData || {}).map((key, index) => generateFormItem(key, index));
        }

        return null;
    };
    /**
     * 动态生成的每一项表单
     */
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

    return {
        dynamicConfigure,
    };
};
