import { useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as Mui from '../mui-form';
import useI18n from '../../hooks/useI18n';

interface useFormProps {
    formItems: UseFormItemsProps[];
}

const useForm = (props: useFormProps) => {
    const { getIntlText } = useI18n();
    const { formItems } = props;

    const forms: FormItemsProps[] = useMemo(() => {
        return formItems?.map((items: UseFormItemsProps) => {
            const { type, render, label, props, ...formItem } = items;
            const Component = { ...(Mui as any), DatePicker }[type];
            const { rules } = items;
            if (rules?.required && rules.required === true) {
                rules.required = getIntlText('valid.input.required');
            }

            return {
                ...formItem,
                rules,
                render:
                    render ||
                    ((data: any) => {
                        const value = data?.field?.value;
                        const onChange = data?.field?.onChange;
                        const error = data?.fieldState?.error;
                        return (
                            <Component
                                {...formItem}
                                {...props}
                                label={label}
                                error={!!error}
                                helperText={error ? error.message : null}
                                value={value}
                                onChange={onChange}
                                fullWidth
                            />
                        );
                    }),
            };
        });
    }, [formItems]);

    return forms;
};

export default useForm;
