import { useState, Fragment } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import { RenderConfig, RenderView } from '../render';
import * as plugins from '../plugins'
import { CustomComponentProps } from '../render/typings';
import './style.less';

interface ConfigPluginProps {
    config: CustomComponentProps;
    onClose: () => void;
}

const ConfigPlugin = (props: ConfigPluginProps) => {
    const { config, onClose } = props;
    const [open, setOpen] = useState(true);
    const ComponentConfig = (plugins as any)[`${config.type}Config`];
    const ComponentView = (plugins as any)[`${config.type}View`];

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
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
                    关闭
                </IconButton>
                <DialogContent>
                    <div className="config-plugin-container">
                        <div className="config-plugin-container-left">
                            {
                                ComponentView ? (
                                    <ComponentView config={{ showTitle: true, title: 'trigger' }} />
                                ) : (
                                    <RenderView configJson={config} config={{ showTitle: true, title: 'trigger' }} />
                                )
                            }
                        </div>
                        <div className="config-plugin-container-right">
                            {
                                ComponentConfig ? (
                                    <ComponentConfig config={config} />
                                ) : (
                                    <RenderConfig config={config} />
                                )
                            }
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default ConfigPlugin;