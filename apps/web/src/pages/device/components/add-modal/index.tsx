import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    type SelectProps,
} from '@mui/material';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { Modal, type ModalProps } from '@milesight/shared/src/components';
import {
    integrationAPI,
    entityAPI,
    awaitWrap,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';

interface Props extends Omit<ModalProps, 'onOk'> {
    onError?: (err: any) => void;
    onSuccess?: () => void;
}

interface FormDataProps {
    /** 集成 ID */
    integration: ApiKey;
}

/**
 * 设备添加弹窗
 */
const AddModal: React.FC<Props> = ({ visible, ...props }) => {
    const { getIntlText } = useI18n();
    const { control, formState, handleSubmit, reset, setValue } = useForm<FormDataProps>();
    const [inteID, setInteID] = useState<ApiKey>('');
    const { data: inteList } = useRequest(
        async () => {
            if (!visible) return;
            const [error, resp] = await awaitWrap(integrationAPI.getList());
            const data = getResponseData(resp);

            if (error || !data || !isRequestSuccess(resp)) return;
            return objectToCamelCase(data);
        },
        { debounceWait: 300, refreshDeps: [visible] },
    );
    const { data: apiDoc } = useRequest(
        async () => {
            if (!inteID) return;
            const [error, resp] = await awaitWrap(
                entityAPI.getApiDoc({ entity_id_list: [inteID] }),
            );
            const data = getResponseData(resp);

            console.log('api doc', resp);
            if (error || !data || !isRequestSuccess(resp)) return;
            return objectToCamelCase(data);
        },
        {
            debounceWait: 300,
            refreshDeps: [inteID],
        },
    );

    const handleIntegrationChange: SelectProps['onChange'] = e => {
        console.log(e, e.target.value);
        setInteID(e.target.value as string);
    };

    return (
        <Modal
            visible={visible}
            title={getIntlText('common.label.add')}
            onOk={() => console.log('handle ok...')}
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
        </Modal>
    );
};

export default AddModal;
