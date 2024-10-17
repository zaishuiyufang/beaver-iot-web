import { useEffect } from 'react';
import type { ViewConfigProps, IConfig, IEntity } from '../../typings';

interface IProps {
    config: IConfig;
    setConfig: (config: IConfig) => void;
    entityMapRef: React.MutableRefObject<{ [key: string]: IEntity }>;
    value: ViewConfigProps;
}
export const useDynamic = ({ value, config, setConfig, entityMapRef }: IProps) => {
    const { entity } = value || {};

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
    const addonConfigure = (currentEntity: IEntity) => {
        const { valueAttribute, valueType } = currentEntity || {};

        if (['boolean', 'enum'].includes(valueType)) {
            const { enum: enumData } = valueAttribute || {};
            const addonFormItems = Object.keys(enumData || {}).map((key, index) =>
                generateFormItem(key, index),
            );

            const { configProps } = config || {};
            const newConfigProps = [
                ...configProps.filter((item: any) => item.$$type !== 'dynamic'),
                ...addonFormItems,
            ];
            config.configProps = newConfigProps;

            setConfig({ ...config });
        }
    };
    useEffect(() => {
        if (!entity) return;

        const currentEntity = entityMapRef.current[entity];
        addonConfigure(currentEntity);
    }, [entity]);
};
