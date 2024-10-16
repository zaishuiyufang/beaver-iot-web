import { useState, useRef } from 'react';
import { Modal, EntityForm } from '@milesight/shared/src/components';
import { RenderView } from '../../../render';
import { ViewConfigProps } from './typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
    configJson: CustomComponentProps;
}

const entities = [
    {
        id: '11',
        key: '222',
        name: '输入11',
        value_attribute: {
            min: 1,
            max: 5,
            displayType: 'int',
        },
    },
    {
        id: '112',
        key: '2223',
        name: '输入22',
        value_attribute: {
            minLength: 1,
            maxLength: 5,
            displayType: 'string',
        },
    },
];

const View = (props: Props) => {
    const { config, configJson } = props;
    const [visible, setVisible] = useState(false);
    const ref = useRef<any>();

    const handleClick = () => {
        setVisible(true);
    };

    const handleOk = () => {
        ref.current?.handleSubmit();
    };

    const handleSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <>
            <RenderView config={config} configJson={configJson} />
            {visible && (
                <Modal title={configJson.name} onOk={handleOk} onCancel={() => setVisible(false)}>
                    <EntityForm ref={ref} entities={entities} onOk={handleSubmit} />
                </Modal>
            )}
        </>
    );
};

export default View;
