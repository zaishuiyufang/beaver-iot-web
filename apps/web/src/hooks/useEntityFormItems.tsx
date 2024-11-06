import { useMemo, useCallback } from 'react';
import { type ControllerProps } from 'react-hook-form';
import {
    TextField,
    FormControl,
    FormLabel,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Switch,
} from '@mui/material';
import { isNil } from 'lodash-es';
import {
    checkRequired,
    checkMinValue,
    checkMaxValue,
    checkRangeValue,
    checkMinLength,
    checkMaxLength,
    checkRangeLength,
} from '@milesight/shared/src/utils/validators';
import { type IntegrationAPISchema } from '@/services/http';

interface Props {
    entities?: ObjectToCamelCase<
        IntegrationAPISchema['getDetail']['response']['integration_entities']
    >;

    /**
     * 是否全部必填
     */
    isAllRequired?: boolean;
}

/**
 * 表单数据类型
 */
export type EntityFormDataProps = Record<string, any>;

/**
 * 获取实体校验规则
 */
const getValidators = (entity: NonNullable<Props['entities']>[0], required = false) => {
    const result: NonNullable<ControllerProps<EntityFormDataProps>['rules']>['validate'] = {};
    const attr = entity.valueAttribute || {};

    if (required && entity.valueType !== 'BOOLEAN') {
        result.checkRequired = checkRequired();
    }

    if (!isNil(attr.min) && !isNil(attr.max)) {
        result.checkRangeValue = checkRangeValue({ min: attr.min, max: attr.max });
    } else if (!isNil(attr.min)) {
        result.checkMinValue = checkMinValue({ min: attr.min });
    } else if (!isNil(attr.max)) {
        result.checkMaxValue = checkMaxValue({ max: attr.max });
    }

    if (!isNil(attr.minLength) && !isNil(attr.maxLength)) {
        result.checkRangeLength = checkRangeLength({ min: attr.minLength, max: attr.maxLength });
    } else if (!isNil(attr.minLength)) {
        result.checkMinLength = checkMinLength({ min: attr.minLength });
    } else if (!isNil(attr.maxLength)) {
        result.checkMaxLength = checkMaxLength({ max: attr.maxLength });
    }

    return result;
};

/**
 * 实体动态表单项
 */
const useEntityFormItems = ({ entities, isAllRequired = false }: Props) => {
    /**
     * 实体 Key & 表单 Key 映射表
     * { [entityKey]: [formKey] }
     */
    const encodedEntityKeys = useMemo(() => {
        const result: Record<string, string> = {};

        entities?.forEach(entity => {
            result[entity.key] = `${entity.key}`.replace(/\./g, '$');
        });

        return result;
    }, [entities]);

    const decodeEntityKey = useCallback(
        (key: string) => {
            const data = Object.entries(encodedEntityKeys).find(([_, value]) => value === key);
            return data?.[0];
        },
        [encodedEntityKeys],
    );

    const decodeFormParams = useCallback(
        (data: Record<string, any>) => {
            const result: Record<string, any> = {};

            Object.entries(data).forEach(([key, value]) => {
                const entityKey = decodeEntityKey(key);
                entityKey && (result[entityKey] = value);
            });

            return result;
        },
        [decodeEntityKey],
    );

    const encodeFormData = useCallback(
        (entities: Props['entities']) => {
            const result = entities?.reduce(
                (acc, item) => {
                    const key = encodedEntityKeys[item.key];

                    key && (acc[key] = item.value);
                    return acc;
                },
                {} as Record<string, any>,
            );

            return result;
        },
        [encodedEntityKeys],
    );

    const formItems = useMemo(() => {
        const result: ControllerProps<EntityFormDataProps>[] = [];

        if (!entities?.length) return result;

        entities?.forEach(entity => {
            const attr = entity.valueAttribute || {};
            const validate = getValidators(entity, isAllRequired);

            switch (entity.valueType) {
                case 'LONG':
                case 'DOUBLE':
                case 'STRING': {
                    const formItem: ControllerProps<EntityFormDataProps> = {
                        name: encodedEntityKeys[entity.key],
                        rules: { validate },
                        defaultValue: '',
                        render({ field: { onChange, value }, fieldState: { error } }) {
                            return (
                                <TextField
                                    fullWidth
                                    type="text"
                                    required={isAllRequired}
                                    label={entity.name}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                    value={value}
                                    onChange={onChange}
                                />
                            );
                        },
                    };

                    // 如果是枚举类型，则渲染下拉框
                    if (attr.enum) {
                        formItem.render = ({
                            field: { onChange, value },
                            fieldState: { error },
                        }) => {
                            return (
                                <FormControl fullWidth size="small" sx={{ my: 1.5 }}>
                                    <InputLabel
                                        required={isAllRequired}
                                        id={`select-label-${entity.name}`}
                                        error={!!error}
                                    >
                                        {entity.name}
                                    </InputLabel>
                                    <Select
                                        notched
                                        label={entity.name}
                                        labelId={`select-label-${entity.name}`}
                                        required={isAllRequired}
                                        error={!!error}
                                        value={value}
                                        onChange={onChange}
                                    >
                                        {Object.entries(attr.enum || {}).map(([_, value]) => (
                                            <MenuItem key={value} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {!!error && (
                                        <FormHelperText error>{error.message}</FormHelperText>
                                    )}
                                </FormControl>
                            );
                        };
                    }

                    result.push(formItem);
                    break;
                }
                case 'BOOLEAN': {
                    result.push({
                        name: encodedEntityKeys[entity.key],
                        rules: { validate },
                        // defaultValue: false,
                        render({ field: { onChange, value }, fieldState: { error } }) {
                            return (
                                <FormControl fullWidth size="small" sx={{ my: 1.5 }}>
                                    <FormLabel error={!!error}>{entity.name}</FormLabel>
                                    <Switch checked={!!value} onChange={onChange} />
                                    {!!error && (
                                        <FormHelperText error>{error.message}</FormHelperText>
                                    )}
                                </FormControl>
                            );
                        },
                    });
                    break;
                }
                case 'BINARY':
                case 'OBJECT': {
                    result.push({
                        name: encodedEntityKeys[entity.key],
                        rules: { validate },
                        defaultValue: '',
                        render({ field: { onChange, value }, fieldState: { error } }) {
                            return (
                                <TextField
                                    fullWidth
                                    multiline
                                    type="text"
                                    rows={4}
                                    required={isAllRequired}
                                    label={entity.name}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                    value={value}
                                    onChange={onChange}
                                />
                            );
                        },
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        });

        return result;
    }, [entities, encodedEntityKeys]);

    return {
        formItems,

        /**
         * 对实体 key 进行解码
         */
        decodeEntityKey,

        /**
         * 对表单参数进行解码
         */
        decodeFormParams,

        /**
         * 将实体数据编码为表单数据
         */
        encodeFormData,
    };
};

export default useEntityFormItems;