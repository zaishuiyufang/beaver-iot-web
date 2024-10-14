import { useMemo } from 'react';
import { Stack, IconButton } from '@mui/material';
import { ListAltIcon, DeleteOutlineIcon } from '@milesight/shared/src/components';
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
                ellipsis: true,
                disableColumnMenu: false,
            },
            {
                field: 'createTime',
                headerName: 'Time',
                width: 150,
                ellipsis: true,
            },
            {
                field: 'source',
                headerName: 'Equipment Source',
                ellipsis: true,
                width: 200,
            },
            {
                field: '$operation',
                headerName: 'Operation',
                // flex: 1,
                minWidth: 100,
                flex: 1,
                renderCell({ row }) {
                    // console.log(row);
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
