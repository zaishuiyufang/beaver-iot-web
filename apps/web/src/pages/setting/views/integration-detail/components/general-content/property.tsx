import { useMemo, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import cls from 'classnames';
import { useI18n } from '@milesight/shared/src/hooks';
import { LoadingButton, toast } from '@milesight/shared/src/components';
import { useEntityFormItems, type EntityFormDataProps } from '@/hooks';
import { entityAPI, awaitWrap, isRequestSuccess } from '@/services/http';
import { type InteEntityType } from '../../hooks';

interface Props {
    /** 实体列表 */
    entities?: InteEntityType[];

    /** 编辑成功回调 */
    onUpdateSuccess?: () => void;
}

/**
 * 属性实体渲染及操作组件
 */
const Property: React.FC<Props> = ({ entities, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();
    const propEntities = useMemo(() => {
        return entities?.filter(item => item.type === 'PROPERTY' && item.accessMod?.includes('W'));
    }, [entities]);

    // ---------- 实体表单相关逻辑处理 ----------
    const { control, formState, handleSubmit, setValue } = useForm<EntityFormDataProps>();
    const { formItems, decodeFormParams, encodeFormData } = useEntityFormItems({
        entities: propEntities,
        isAllRequired: true,
    });
    const onSubmit: SubmitHandler<EntityFormDataProps> = async params => {
        const finalParams = decodeFormParams(params);

        if (!finalParams) {
            console.warn(`params is empty, the origin params is ${JSON.stringify(params)}`);
            return;
        }

        const [error, resp] = await awaitWrap(entityAPI.updateProperty({ exchange: finalParams }));
        if (error || !isRequestSuccess(resp)) return;

        onUpdateSuccess?.();
        toast.success({ content: getIntlText('common.message.operation_success') });
    };

    // 表单数据回填
    useEffect(() => {
        if (!propEntities?.length) return;

        const formData = encodeFormData(propEntities);

        Object.entries(formData || {}).forEach(([key, value]) => {
            setValue(key, value);
        });
    }, [propEntities, setValue, encodeFormData]);

    return (
        <div className={cls('ms-entity-property', { loading: formState.isSubmitting })}>
            <div className="form-wrap">
                {formItems.map(props => (
                    <Controller<EntityFormDataProps>
                        {...props}
                        key={props.name}
                        control={control}
                    />
                ))}
            </div>
            <LoadingButton
                variant="contained"
                loading={formState.isSubmitting}
                onClick={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
            >
                {getIntlText('common.button.save')}
            </LoadingButton>
        </div>
    );
};

export default Property;
