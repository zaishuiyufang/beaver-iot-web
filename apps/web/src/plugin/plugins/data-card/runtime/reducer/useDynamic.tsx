import type { ConfigureType, ViewConfigProps } from '../../typings';

export const useDynamic = () => {
    /**
     * 动态生成的每一项表单
     */
    const generateFormItem = (title: string, index: string) => {
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
                    key: `Icon_${index}`,
                    style: 'flex: 1;padding-right: 12px;',
                    componentProps: {
                        size: 'small',
                    },
                },
                {
                    type: 'iconColorSelect',
                    key: `IconColor_${index}`,
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
    const dynamicConfigure = (currentEntity: Required<EntityOptionType>['rawData']) => {
        const { entityValueAttribute, entityId } = currentEntity || {};
        const { enum: enumStruct } = entityValueAttribute || {};

        // 非枚举类型
        if (!enumStruct) return [generateFormItem(`Appearance`, entityId?.toString())];

        // 枚举类型
        return Object.keys(enumStruct || {}).map(enumKey => {
            const enumValue = enumStruct[enumKey];
            return generateFormItem(`Appearance of ${enumValue}`, enumKey);
        });
    };

    /** 动态渲染表单 */
    const updateDynamicForm = (value: ViewConfigProps, config: ConfigureType) => {
        const { entity } = value || {};
        // 获取当前选中实体
        const { rawData: currentEntity } = entity || {};
        if (!currentEntity) return config;

        // 渲染动态表单
        const result = dynamicConfigure(currentEntity);
        if (!result) return config;

        // 动态渲染表单
        const { configProps } = config || {};
        const newConfigProps = [
            ...configProps.filter((item: any) => item.$$type !== 'dynamic'),
            ...result,
        ];
        config.configProps = newConfigProps;
        return config;
    };

    return {
        updateDynamicForm,
    };
};
