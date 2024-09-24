import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { Add as AddIcon, DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { Breadcrumbs, TablePro, useConfirm } from '@/components';
import { type DeviceDetail } from '@/services/http';
import { useColumns, type UseColumnsProps } from './hooks';
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
    const confirm = useConfirm();
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<AddIcon />}
                >
                    Add
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
                    Delete
                </Button>
            </Stack>
        );
    }, []);
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
                        toolbarRender={toolbarRender}
                        onSearch={() => console.log('search')}
                        onRefreshButtonClick={() => console.log('refresh')}
                    />
                </div>
            </div>
        </div>
    );
};
