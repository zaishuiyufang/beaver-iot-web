import React, { useMemo } from 'react';
import { isUndefined } from 'lodash-es';
import { OutlinedInput, InputAdornment } from '@mui/material';
import {
    DataGrid,
    type DataGridProps,
    type GridValidRowModel,
    type GridColDef,
} from '@mui/x-data-grid';
import { SearchIcon } from '@milesight/shared/src/components';
import Tooltip from '../tooltip';
import { Footer, NoDataOverlay, NoResultsOverlay } from './components';
import './style.less';

export type ColumnType<R extends GridValidRowModel = any, V = any, F = V> = GridColDef<R, V, F> & {
    /**
     * 文案是否自动省略（仅当列配置中无自定义 `renderCell` 时生效）
     */
    ellipsis?: boolean;
};

interface Props<T extends GridValidRowModel> extends DataGridProps<T> {
    columns: ColumnType<T>[];

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
    columns,
    initialState,
    slots,
    slotProps,
    toolbarRender,
    onSearch,
    onRefreshButtonClick,
    ...props
}: Props<DataType>) => {
    const memoColumns = useMemo(() => {
        const result = columns.map((column, index) => {
            const col = { ...column };

            col.sortable = isUndefined(col.sortable) ? false : col.sortable;
            col.disableColumnMenu = isUndefined(col.disableColumnMenu)
                ? true
                : column.disableColumnMenu;

            if (columns.length === index + 1) {
                col.align = isUndefined(col.align) ? 'left' : col.align;
                col.headerAlign = isUndefined(col.headerAlign) ? 'right' : col.headerAlign;
                col.resizable = isUndefined(col.resizable) ? false : col.resizable;
            }

            if (col.ellipsis && !col.renderCell) {
                col.renderCell = ({ value }) => (
                    <Tooltip
                        autoEllipsis
                        title={value}
                        slotProps={{
                            popper: {
                                modifiers: [{ name: 'offset', options: { offset: [0, -20] } }],
                            },
                        }}
                    >
                        <span>{value}</span>
                    </Tooltip>
                );
            }
            return col;
        });

        return result as readonly GridColDef<DataType>[];
    }, [columns]);

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
                    columns={memoColumns}
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
                        baseCheckbox: {
                            // disabled: true,
                            onDoubleClick(e) {
                                e.stopPropagation();
                            },
                        },
                        ...slotProps,
                    }}
                    {...props}
                />
            </div>
        </div>
    );
};

// export type { GridColDef as ColumnType };
export default TablePro;
