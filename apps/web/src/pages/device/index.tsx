import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { AddIcon, DeleteOutlineIcon } from '@milesight/shared/src/components';
import { Breadcrumbs, TablePro, useConfirm } from '@/components';
import { type DeviceDetail } from '@/services/http';
import { useColumns, type UseColumnsProps } from './hooks';
import { AddModal } from './components';
import './style.less';

const mockList = (() => {
    const data = {
        id: 1,
        name: 'AM308',
        createTime: 1727058769161,
        source: 'Milesight Development Platform',
    };

    return new Array(100).fill({ ...data }).map((item, index) => {
        return { ...item, id: `${item.id}-${index}`, name: `${item.name}-${index}` };
    });
})();

export default () => {
    const navigate = useNavigate();
    const { getIntlText } = useI18n();
    const confirm = useConfirm();
    const [modalOpen, setModalOpen] = useState(false);
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    onClick={() => setModalOpen(true)}
                >
                    {getIntlText('common.label.add')}
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => {
                        confirm({
                            title: 'Delete',
                            description: 'Are you sure to delete?',
                            confirmButtonText: 'Delete',
                            confirmButtonProps: {
                                color: 'error',
                            },
                            onConfirm: () => {
                                console.log('confirm...');
                            },
                        });
                    }}
                >
                    {getIntlText('common.label.delete')}
                </Button>
            </Stack>
        );
    }, [getIntlText]);

    const handleTableBtnClick: UseColumnsProps<DeviceDetail>['onButtonClick'] = useCallback(
        (type, record) => {
            console.log(type, record);
            switch (type) {
                case 'detail': {
                    console.log('go to detail');
                    navigate(`/device/detail/${record.id}`);
                    break;
                }
                case 'delete': {
                    console.log('delete');
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [navigate],
    );
    const columns = useColumns<DeviceDetail>({ onButtonClick: handleTableBtnClick });

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-device">
                <div className="ms-view__inner">
                    <TablePro<DeviceDetail>
                        checkboxSelection
                        columns={columns}
                        rows={mockList}
                        rowCount={50}
                        onRowDoubleClick={({ row }) => {
                            navigate(`/device/detail/${row.id}`);
                        }}
                        toolbarRender={toolbarRender}
                        onSearch={() => console.log('search')}
                        onRefreshButtonClick={() => console.log('refresh')}
                    />
                </div>
            </div>
            <AddModal visible={modalOpen} onCancel={() => setModalOpen(false)} />
        </div>
    );
};
