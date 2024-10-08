import { useRef, useState } from 'react';
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
    const ComponentConfig = (plugins as any)[`${config.type}Config`];
    const ComponentView = (plugins as any)[`${config.type}View`];
    const formRef = useRef<any>();
    const [formValues, setFormValues] = useState<any>({});

    const handleClose = () => {
        onClose();
    };

    const handleChange = (values: any) => {
        setFormValues(values);
    };

    const handleOk = () => {
        formRef.current?.handleSubmit();
    };

    const handleSubmit = (data: any) => {
        onOk(data);
    };

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
                            <ComponentView config={formValues} />
                        ) : (
                            <RenderView configJson={config} config={formValues} />
                        )
                    }
                </div>
                <div className="config-plugin-container-right">
                    {
                        ComponentConfig ? (
                            <ComponentConfig config={config} onChange={handleChange} />
                        ) : (
                            <RenderConfig config={config} onOk={handleSubmit} ref={formRef} onChange={handleChange} />
                        )
                    }
                </div>
            </div>
        </Modal>
    );
}

export default ConfigPlugin;