import { useState, useRef } from 'react';
import { Modal, EntityForm } from '@milesight/shared/src/components';
import { useEntityApi, type CallServiceType } from '../../../hooks';
import { RenderView } from '../../../render';
import { ViewConfigProps } from './typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
    configJson: CustomComponentProps;
}

const View = (props: Props) => {
    const { getEntityChildren, callService, updateProperty } = useEntityApi();
    const { config, configJson } = props;
    const [visible, setVisible] = useState(false);
    const [entities, setEntities] = useState([]);
    const ref = useRef<any>();

    // 调用服务
    const handleCallService = () => {
        callService({
            entity_id: (config?.entity as any)?.value as ApiKey,
            exchange: {
                entity_id: (config?.entity as any)?.value as ApiKey,
            },
        } as CallServiceType);
    };

    const handleUpdateProperty = async (data: Record<string, any>) => {
        const { error } = await updateProperty({
            entity_id: (config?.entity as any)?.value as ApiKey,
            exchange: data,
        } as CallServiceType);
        console.log(error);
        if (!error) {
            setVisible(false);
        }
    };

    const handleClick = async () => {
        if (configJson.isPreview) {
            return;
        }
        const { error, res } = await getEntityChildren({
            id: (config?.entity as any)?.value as ApiKey,
        });
        if (!error) {
            if (res?.length) {
                setEntities(
                    res.map((item: EntityData) => {
                        return {
                            id: item.entity_id,
                            key: item.entity_key,
                            name: item.entity_name,
                            value_attribute: item.entity_value_attribute,
                        };
                    }),
                );
                setVisible(true);
            } else {
                handleCallService();
            }
        }
    };

    const handleOk = () => {
        ref.current?.handleSubmit();
    };

    const handleSubmit = (data: Record<string, any>) => {
        handleUpdateProperty(data);
    };

    return (
        <>
            <RenderView config={config} configJson={configJson} onClick={handleClick} />
            {visible && (
                <Modal
                    title={configJson.name}
                    onOk={handleOk}
                    onCancel={() => setVisible(false)}
                    visible
                >
                    {/* @ts-ignore: Mock 数据字段缺失，暂忽略 ts 校验报错 */}
                    <EntityForm ref={ref} entities={entities} onOk={handleSubmit} />
                </Modal>
            )}
        </>
    );
};

export default View;
