import { useState, useRef } from 'react';
import { Modal } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';
import { RenderConfig, RenderView } from '../render';
import * as plugins from '../plugins'
import './style.less';

interface ConfigPluginProps {
    config: CustomComponentProps;
    onClose: () => void;
    onOk: (data: any) => void;
}

const ConfigPlugin = (props: ConfigPluginProps) => {
    const { getIntlText } = useI18n();
    const { config, onClose, onOk } = props;
    const [open, setOpen] = useState(true);
    const [configJson, setConfigJson] = useState();
    const ComponentConfig = (plugins as any)[`${config.type}Config`];
    const ComponentView = (plugins as any)[`${config.type}View`];
    const formRef = useRef<any>();

    console.log(ComponentConfig);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleOk = () => {
        formRef.current?.handleSubmit();
    }

    const handleSumbit = (data: any) => {
        onOk(data);
    }

    return (
        <Modal
            onCancel={handleClose}
            onOk={handleOk}
            title={getIntlText('common.plugin_add_title', { 1: config.type })}
            width="80%"
        >
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
                            <RenderConfig config={config} onOk={handleSumbit} ref={formRef} />
                        )
                    }
                </div>
            </div>
        </Modal>
    );
}

export default ConfigPlugin;