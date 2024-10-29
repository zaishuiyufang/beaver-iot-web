import React, { useCallback, useState } from 'react';
import { useRequest, useMemoizedFn } from 'ahooks';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    type SelectProps,
} from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { Modal, toast, type ModalProps } from '@milesight/shared/src/components';
import {
    integrationAPI,
    deviceAPI,
    awaitWrap,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import useDynamicFormItems, { type FormDataProps } from './useDynamicFormItems';

interface Props extends Omit<ModalProps, 'onOk'> {
    /** 添加失败回调 */
    onError?: (err: any) => void;

    /** 添加成功回调 */
    onSuccess?: () => void;
}

/**
 * 设备添加弹窗
 */
const AddModal: React.FC<Props> = ({ visible, onCancel, onError, onSuccess, ...props }) => {
    const { getIntlText } = useI18n();

    // ---------- 集成相关逻辑处理 ----------
    const [inteID, setInteID] = useState<ApiKey>('');
    const { data: inteList } = useRequest(
        async () => {
            if (!visible) return;
            const [error, resp] = await awaitWrap(integrationAPI.getList({ device_addable: true }));
            const data = getResponseData(resp);

            if (error || !data || !isRequestSuccess(resp)) return;
            return objectToCamelCase(data);
        },
        { debounceWait: 300, refreshDeps: [visible] },
    );
    const handleIntegrationChange: SelectProps['onChange'] = e => {
        console.log(e, e.target.value);
        setInteID(e.target.value as string);
    };

    // ---------- 实体表单相关逻辑处理 ----------
    const { control, formState, handleSubmit, reset } = useForm<FormDataProps>();
    const { data: entities } = useRequest(
        async () => {
            if (!inteID) return;
            const [error, resp] = await awaitWrap(integrationAPI.getDetail({ id: inteID }));
            const respData = getResponseData(resp);

            if (error || !respData || !isRequestSuccess(resp)) return;

            const data = objectToCamelCase(respData);
            const addDeviceKey = data.addDeviceServiceKey;
            const list = data.integrationEntities?.filter(item => {
                // TODO: 接口 addDeviceKey 字段错误，暂时写死，方便调试
                return `${item.key}`.includes('msc-integration.integration.add_device');
                // return `${item.key}`.includes(`${addDeviceKey}`);
            });

            return list;
        },
        {
            debounceWait: 300,
            refreshDeps: [inteID],
        },
    );
    const formItems = useDynamicFormItems({ entities });
    const onSubmit: SubmitHandler<FormDataProps> = async ({ name, ...params }) => {
        const entityParams = Object.entries(params).reduce(
            (acc, [name, value]) => {
                const entity = entities?.find(item => item.name === name);

                entity && (acc[entity?.key] = value);
                return acc;
            },
            {} as Record<string, any>,
        );
        const [error, resp] = await awaitWrap(
            deviceAPI.addDevice({ name, integration: inteID, param_entities: entityParams }),
        );

        console.log({ error, resp });
        if (error || !isRequestSuccess(resp)) {
            onError?.(error);
            return;
        }

        reset();
        setInteID('');
        onSuccess?.();
        toast.success(getIntlText('common.message.add_success'));
    };

    const handleCancel = useMemoizedFn(() => {
        reset();
        setInteID('');
        onCancel?.();
    });

    return (
        <Modal
            visible={visible}
            title={getIntlText('common.label.add')}
            onOk={handleSubmit(onSubmit)}
            onCancel={handleCancel}
            {...props}
        >
            <FormControl fullWidth size="small" disabled={formState.isSubmitting} sx={{ my: 1.5 }}>
                <InputLabel id="select-label-address">
                    {getIntlText('common.label.integration')}
                </InputLabel>
                <Select
                    label={getIntlText('common.label.integration')}
                    labelId="select-label-address"
                    value={inteID}
                    onChange={handleIntegrationChange}
                >
                    {inteList?.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {formItems.map(props => (
                <Controller<FormDataProps> {...props} key={props.name} control={control} />
            ))}
        </Modal>
    );
};

export default AddModal;
