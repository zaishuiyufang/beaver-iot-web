import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm, Controller, FieldValues, type SubmitHandler } from 'react-hook-form';
import { isEqual } from 'lodash-es';
import useFormItems from './useForm';

interface formProps<T extends FieldValues> {
    formItems: UseFormItemsProps[];
    onOk: (data: T) => void;
    onChange?: (data: T) => void;
}

const Forms = <T extends FieldValues>(props: formProps<T>, ref: any) => {
    const { formItems, onOk, onChange } = props;
    const { handleSubmit, control, watch } = useForm<T>({ mode: 'onChange' });
    const forms: FormItemsProps[] = useFormItems({ formItems });
    const formValuesRef = useRef<T>();

    // 监听所有表单字段的变化
    const formValues = watch();

    useEffect(() => {
        if (!formValuesRef?.current || !isEqual(formValuesRef?.current, formValues)) {
            formValuesRef.current = { ...formValues };
            // 表单值变更回调
            !!onChange && onChange(formValues);
        }
    }, [formValues]);

    const onSubmit: SubmitHandler<T> = (data: T) => {
        onOk(data);
    };

    /** 暴露给父组件的方法 */
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit(onSubmit),
    }));

    const renderMulForm = (index: number) => {
        const list =
            forms.filter(
                (item, i) => item.multiple && i >= index && i < index + item.multipleIndex + 1,
            ) || [];
        if (!list?.length) {
            return null;
        }
        return (
            <div style={list[0].style as any}>
                {list.map((item: FormItemsProps) => {
                    return <Controller<T> key={item.name} {...item} control={control} />;
                })}
            </div>
        );
    };

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {forms?.map((item: FormItemsProps, index: number) => {
                if (item.multiple) {
                    return item.multipleIndex === 0 ? renderMulForm(index) : null;
                }
                return <Controller<T> key={item.name} {...item} control={control} />;
            })}
        </>
    );
};

export const ForwardForms = forwardRef(Forms) as unknown as <T extends FieldValues>(
    props: React.PropsWithChildren<formProps<T>> & {
        ref?: React.ForwardedRef<formProps<T>>;
    },
) => React.ReactElement;

export default ForwardForms;
