import { useState, Fragment } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import * as plugins from '../plugins';
import { ConfigProps } from './typings';
import './style.less';

interface ConfigPluginProps {
    config: ConfigProps;
}

const ConfigPlugin = (props: ConfigPluginProps) => {
    const { config } = props;
    const [open, setOpen] = useState(true);
    const ComponentConfig = (plugins as any)[`${config.type}Config`];
    const ComponentView = (plugins as any)[`${config.type}View`];

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: 'none' } }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Add {config.type}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    111
                </IconButton>
                <DialogContent>
                    <div className="config-plugin-container">
                        <div className="config-plugin-container-left">
                            <ComponentView config={{ showTitle: true, title: 'trigger' }} />
                        </div>
                        <div className="config-plugin-container-right">
                            <ComponentConfig />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default ConfigPlugin;