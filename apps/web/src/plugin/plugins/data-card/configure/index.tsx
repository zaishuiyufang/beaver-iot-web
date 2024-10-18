import { forwardRef } from 'react';
import { RenderConfig } from '../../../render';
import { useAction, useReducer } from '../runtime';
import type { ConfigureType, ViewConfigProps } from '../typings';

interface ConfigPluginProps {
    value: ViewConfigProps;
    config: ConfigureType;
    onOk: (data: any) => void;
    onChange: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { value, config, onOk, onChange } = props;

    useAction({ value, config });
    const { configure } = useReducer({ value, config });

    return (
        <RenderConfig value={value} config={configure} ref={ref} onOk={onOk} onChange={onChange} />
    );
});

export default Plugin;
