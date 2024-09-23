import React from 'react';
import { OutlinedInput, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import {
    DataGrid,
    type DataGridProps,
    type GridValidRowModel,
    type GridColDef,
} from '@mui/x-data-grid';
import { Footer, NoDataOverlay, NoResultsOverlay } from './components';
import './style.less';

interface Props<T extends GridValidRowModel> extends DataGridProps<T> {
    /**
     * 工具栏插槽（左侧自定义渲染 Node）
     */
    toolbarRender?: React.ReactNode;

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
const TablePro = <DataType extends GridValidRowModel>({
    initialState,
    slots,
    slotProps,
    toolbarRender,
    onSearch,
    onRefreshButtonClick,
    ...props
}: Props<DataType>) => {
    return (
        <div className="ms-table-pro">
            {!!(toolbarRender || onSearch) && (
                <div className="ms-table-pro__header">
                    <div className="ms-table-pro__topbar-operations">{toolbarRender}</div>
                    {!!onSearch && (
                        <div className="ms-table-pro__topbar-search">
                            <OutlinedInput
                                placeholder="Search"
                                sx={{ width: 220, height: 40 }}
                                onChange={e => onSearch?.(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </div>
                    )}
                </div>
            )}
            <div className="ms-table-pro__body">
                <DataGrid<DataType>
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
                        noResultsOverlay: NoResultsOverlay,
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
};

export type { GridColDef as ColumnType };
export default TablePro;
