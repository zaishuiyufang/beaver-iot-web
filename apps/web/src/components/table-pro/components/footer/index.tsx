import React from 'react';
import { IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import {
    GridFooterContainer,
    GridPagination,
    type GridFooterContainerProps,
} from '@mui/x-data-grid';

interface CustomFooterProps extends GridFooterContainerProps {
    /** 刷新按钮点击回调 */
    onRefreshButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * 自定义表格页脚组件
 */
const CustomFooter: React.FC<CustomFooterProps> = ({ onRefreshButtonClick, ...props }) => {
    return (
        <GridFooterContainer {...props}>
            <IconButton
                size="small"
                onClick={onRefreshButtonClick}
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '4px',
                    border: '1px solid #e5e5e5',
                    color: 'text.secondary',
                }}
            >
                <Refresh sx={{ width: 24, height: 24 }} />
            </IconButton>
            <GridPagination />
        </GridFooterContainer>
    );
};

export default CustomFooter;
