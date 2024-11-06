import { useMemo } from 'react';
import { type ControllerProps } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { type IntegrationAPISchema } from '@/services/http';

interface Props {
    entities?: ObjectToCamelCase<
        IntegrationAPISchema['getDetail']['response']['integration_entities']
    >;
}

/**
 * 表单数据类型
 */
export type FormDataProps = Record<string, any>;

/**
 * 添加设备动态表单项
 */
const useDynamicFormItems = ({ entities }: Props) => {
    const { getIntlText } = useI18n();

    const formItems = useMemo(() => {
        const result: ControllerProps<FormDataProps>[] = [];

        if (!entities?.length) return result;

        result.push({
            name: 'name',
            rules: {
                validate: { checkRequired: checkRequired() },
            },
            defaultValue: '',
            render({ field: { onChange, value }, fieldState: { error } }) {
                return (
                    <TextField
                        required
                        fullWidth
                        type="text"
                        label={getIntlText('common.label.name')}
                        error={!!error}
                        helperText={error ? error.message : null}
                        value={value}
                        onChange={onChange}
                    />
                );
            },
        });

        entities?.forEach(entity => {
            if (entity.valueType === 'OBJECT') return;

            switch (entity.valueType) {
                case 'LONG':
                case 'DOUBLE':
                case 'STRING': {
                    result.push({
                        name: entity.name,
                        // rules: {
                        //     validate: { checkRequired: checkRequired() },
                        // },
                        defaultValue: '',
                        render({ field: { onChange, value }, fieldState: { error } }) {
                            return (
                                <TextField
                                    fullWidth
                                    type="text"
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
                case 'BOOLEAN': {
                    break;
                }
                case 'BINARY': {
                    break;
                }
                default: {
                    break;
                }
            }
        });

        return result;
    }, [entities, getIntlText]);

    return formItems;
};

export default useDynamicFormItems;
