import { useMemo } from 'react';
import { Stack, IconButton } from '@mui/material';
import { ListAlt as ListAltIcon, DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import { type ColumnType } from '@/components';
import { type DeviceDetail } from '@/services/http';

type OperationType = 'detail' | 'delete';

export interface UseColumnsProps<T> {
    /**
     * 操作 Button 点击回调
     */
    onButtonClick: (type: OperationType, record: T) => void;
}

const useColumns = <T extends DeviceDetail>({ onButtonClick }: UseColumnsProps<T>) => {
    const columns: ColumnType<T>[] = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: 'Device Name',
                width: 150,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
            },
            {
                field: 'createTime',
                headerName: 'Time',
                width: 150,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
            },
            {
                field: 'source',
                headerName: 'Equipment Source',
                align: 'left',
                headerAlign: 'left',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                width: 200,
            },
            {
                field: '$operation',
                headerName: 'Operation',
                // flex: 1,
                minWidth: 100,
                align: 'right',
                headerAlign: 'right',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                resizable: false,
                flex: 1,
                renderCell({ row }) {
                    // console.log(cell);
                    return (
                        <Stack
                            direction="row"
                            spacing="4px"
                            sx={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}
                        >
                            <IconButton
                                sx={{ width: 30, height: 30 }}
                                onClick={() => onButtonClick('detail', row)}
                            >
                                <ListAltIcon sx={{ width: 20, height: 20 }} />
                            </IconButton>
                            <IconButton
                                color="error"
                                sx={{
                                    width: 30,
                                    height: 30,
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.light' },
                                }}
                                onClick={() => onButtonClick('delete', row)}
                            >
                                <DeleteOutlineIcon sx={{ width: 20, height: 20 }} />
                            </IconButton>
                        </Stack>
                    );
                },
            },
        ];
    }, [onButtonClick]);

    return columns;
};

export default useColumns;
