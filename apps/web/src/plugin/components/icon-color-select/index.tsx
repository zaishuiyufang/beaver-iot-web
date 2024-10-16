import { useState } from 'react';
import { Box, MenuItem } from '@mui/material';
import { SketchPicker } from 'react-color';
import Select from '../select';
import './style.less';

const IconColorSelect = (props: any) => {
    const { value, onChange, ...rest } = props;
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleColorChange = (color: any) => {
        onChange(color.hex);
        handleClose();
    };

    return (
        <Select
            {...rest}
            onOpen={handleOpen}
            onClose={handleClose}
            open={open}
            value={value}
            renderValue={() => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        className="icon-color-select-value"
                        sx={{
                            backgroundColor: value,
                        }}
                    />
                    {rest.value}
                </Box>
            )}
            renderOptions={() => {
                return (
                    <MenuItem onClick={handleOpen}>
                        <div
                            onClick={(e: any) => {
                                e.stopPropagation();
                            }}
                        >
                            <SketchPicker color={value} onChangeComplete={handleColorChange} />
                        </div>
                    </MenuItem>
                );
            }}
        />
    );
};

export default IconColorSelect;
