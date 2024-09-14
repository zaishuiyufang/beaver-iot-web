import React from 'react';
import { DataGrid, type DataGridProps } from '@mui/x-data-grid';
import { Footer, NoDataOverlay, NoResultOverlay } from './components';

interface Props extends DataGridProps {
    /** 搜索框输入回调 */
    onSearch?: (value: string) => void;

    /** 刷新按钮点击回调 */
    onRefreshButtonClick?: () => void;
}

/** 默认每页显示数量选项 */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

/** 默认分页模型 */
const DEFAULT_PAGINATION_MODEL = { page: 0, pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0] };

/**
 * 数据表格组件
 */
const TablePro: React.FC<Props> = React.memo(
    ({ initialState, slots, slotProps, onSearch, onRefreshButtonClick, ...props }) => {
        return (
            <div className="ms-table-pro">
                <div className="ms-table-pro__header">
                    <span>Buttons</span>
                </div>
                <div className="ms-table-pro__body">
                    <DataGrid
                        disableRowSelectionOnClick
                        hideFooterSelectedRowCount
                        sx={{ border: 0 }}
                        columnHeaderHeight={44}
                        paginationMode="server"
                        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
                        initialState={{
                            pagination: { paginationModel: DEFAULT_PAGINATION_MODEL },
                            ...initialState,
                        }}
                        slots={{
                            noRowsOverlay: NoDataOverlay,
                            // noResultOverlay: NoResultOverlay,
                            footer: Footer,
                            ...slots,
                        }}
                        slotProps={{
                            footer: {
                                // @ts-ignore
                                onRefreshButtonClick,
                            },
                            ...slotProps,
                        }}
                        {...props}
                    />
                </div>
            </div>
        );
    },
);

export default TablePro;
