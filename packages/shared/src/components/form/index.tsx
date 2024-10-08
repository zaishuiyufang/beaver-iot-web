import { Fragment, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
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
        handleSubmit: handleSubmit(onSubmit)
    }));


    return (
        <Fragment>
            {
                forms?.map(item => {
                    return < Controller<T> key={item.name} {...item} control={control} />
                })
            }
        </Fragment>
    );
};

export const ForwardForms = forwardRef(Forms) as unknown as <
    T extends FieldValues,
>(
    props: React.PropsWithChildren<formProps<T>> & {
        ref?: React.ForwardedRef<formProps<T>>;
    },
) => React.ReactElement;

export default ForwardForms;