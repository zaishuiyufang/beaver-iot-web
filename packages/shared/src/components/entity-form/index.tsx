import { useMemo, forwardRef } from 'react';
import Form from '../form';
import { entityType } from './contanst';

const EntityForm = forwardRef((props: EntityFormProps, ref: any) => {
    const { entities, onOk } = props;

    // 获取组件类型
    const getComponentType = (entity: EntityType) => {
        const type = entity?.value_attribute?.displayType;
        switch (type) {
            case entityType.string:
            case entityType.int:
            case entityType.float:
                return 'TextField';
            case entityType.boolean:
                return 'Checkbox';
            case entityType.date:
                return 'DatePicker';
            case entityType.enum:
                return 'Select';
            default:
                return 'TextField';
        }
    };

    // 获取组件配置
    const getComponentProps = (entity: EntityType) => {
        const type = entity?.value_attribute?.displayType;
        const componentProps: any = {};
        switch (type) {
            case entityType.enum:
                componentProps.options = entity?.value_attribute?.enumValues || [];
                break;
            case entityType.int:
            case entityType.float:
                componentProps.type = 'number';
                break;
            default:
        }
        return componentProps;
    };

    // 获取组件校验规则
    const getComponentRules = (entity: EntityType) => {
        const type = entity?.value_attribute?.displayType;
        const attr: any = entity?.value_attribute || {};
        const rules: rulesType = {};
        switch (type) {
            case entityType.string:
                if (attr.minLength) {
                    rules.minLength = {
                        value: attr.minLength,
                        message: `最小长度为${attr.minLength}`,
                    };
                }
                if (attr.maxLength) {
                    rules.maxLength = {
                        value: attr.maxLength,
                        message: `最大长度为${attr.maxLength}`,
                    };
                }
                break;
            case entityType.int:
            case entityType.float:
                if (attr.min) {
                    rules.min = { value: attr.min, message: `最小值为${attr.min}` };
                }
                if (attr.max) {
                    rules.max = { value: attr.max, message: `最大值为${attr.max}` };
                }
                break;
            default:
        }
        return rules;
    };

    const formItems: UseFormItemsProps[] = useMemo(() => {
        if (entities?.length) {
            const forms: UseFormItemsProps[] = [];
            entities.forEach((entity: EntityType) => {
                const item: UseFormItemsProps = {
                    label: entity.name,
                    name: entity.key,
                    type: getComponentType(entity),
                    props: {
                        ...getComponentProps(entity),
                    },
                    rules: getComponentRules(entity),
                };
                forms.push(item);
            });
            return forms;
        }
        return [];
    }, [entities]);

    return <Form formItems={formItems} onOk={onOk} ref={ref} />;
});

export default EntityForm;
