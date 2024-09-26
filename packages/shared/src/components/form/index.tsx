import { Fragment, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, FieldValues, type SubmitHandler } from 'react-hook-form';
import useFormItems from './useForm';

interface formProps<T extends FieldValues> {
    formItems: UseFormItemsProps[];
    onOk: (data: T) => void;
}

const Forms = <T extends FieldValues>(props: formProps<T>, ref: any) => {
    const { formItems, onOk } = props;
    const { handleSubmit, control } = useForm<T>({ mode: 'onChange' });
    const forms: FormItemsProps[] = useFormItems({ formItems });

    const onSubmit: SubmitHandler<T> = data => {
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