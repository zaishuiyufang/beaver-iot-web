import { useCallback, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { Stack, IconButton } from '@mui/material';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { EditIcon } from '@milesight/shared/src/components';
import { Descriptions, Tooltip } from '@/components';
import { deviceAPI, type DeviceDetail } from '@/services/http';
import EditDialog from './edit-dialog';

const mockData: DeviceDetail = {
    id: 11,
    externalId: 22,
    name: 'AM308',
    createTime: 1727072105549,
    founder: 'System',
    source: 'Milesight Development Platform',
};

export interface BasicTableInstance {
    /** 打开编辑弹窗 */
    openEditDialog: () => void;
}

/**
 * 设备基本信息表格
 */
const BasicTable = (_: any, ref?: React.ForwardedRef<BasicTableInstance>) => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();
    const [dialogOpen, setDialogOpen] = useState(false);
    const descList = useMemo(() => {
        return [
            {
                key: 'name',
                label: getIntlText('common.label.name'),
                content: (
                    <Stack
                        direction="row"
                        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Tooltip autoEllipsis title={mockData.name} />
                        <IconButton
                            sx={{ width: 22, height: 22 }}
                            onClick={() => {
                                setDialogOpen(true);
                            }}
                        >
                            <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Stack>
                ),
            },
            {
                key: 'externalId',
                label: getIntlText('device.label.param_entity_id'),
                content: mockData.externalId,
            },
            {
                key: 'source',
                label: getIntlText('device.label.param_source'),
                content: <Tooltip autoEllipsis title={mockData.source} />,
            },
            {
                key: 'createTime',
                label: getIntlText('common.label.create_time'),
                content: getTimeFormat(mockData.createTime),
            },
            {
                key: 'founder',
                label: getIntlText('device.label.param_founder'),
                content: mockData.founder,
            },
            {
                key: 'id',
                label: getIntlText('device.label.param_device_id'),
                content: mockData.id,
            },
        ];
    }, [getIntlText, getTimeFormat]);
    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
    }, []);

    // 暴露给父组件的实例
    useImperativeHandle(ref, () => {
        return {
            openEditDialog: () => {
                setDialogOpen(true);
            },
        };
    });

    return (
        <div className="ms-com-device-basic">
            <Descriptions data={descList} />
            <EditDialog
                open={dialogOpen}
                data={mockData}
                onCancel={handleDialogClose}
                onError={handleDialogClose}
                onSuccess={() => {
                    // Todo: 刷新列表
                    handleDialogClose();
                }}
            />
        </div>
    );
};

const ForwardBasicTable = (forwardRef as FixedForwardRef)<BasicTableInstance, any>(BasicTable);

export default ForwardBasicTable;
