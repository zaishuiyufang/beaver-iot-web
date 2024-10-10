import { useMemo, useState, useCallback } from 'react';
import { WifiRounded as WifiRoundedIcon } from '@mui/icons-material';

import Switch from '@/plugin/components/switch';

import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: string;
        switchText?: string;
        offIcon?: string;
        offIconColor?: string;
        onIcon?: string;
        onIconColor?: string;
    };
}

const View = (props: ViewProps) => {
    const { config } = props;
    const { entity, switchText, onIconColor, offIconColor } = config;

    console.log('ViewProps ? ', props);

    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const handleSwitchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, val: boolean) => {
            setIsSwitchOn(val);
        },
        [],
    );

    /**
     * 右边大 icon 的展示的颜色
     */
    const iconColor = useMemo(() => {
        return isSwitchOn ? onIconColor : offIconColor;
    }, [isSwitchOn, onIconColor, offIconColor]);

    /**
     * switch title
     */
    const switchTitle = useMemo(() => {
        return isSwitchOn ? 'On' : 'Off';
    }, [isSwitchOn]);

    return (
        <div className={styles['switch-wrapper']}>
            <div className={styles.content}>
                <div className={styles.body}>
                    <Switch value={isSwitchOn} title={switchTitle} onChange={handleSwitchChange} />
                </div>
                <div className={styles.text}>{switchText || `Switch-${entity || '1'}`}</div>
            </div>
            <div className={styles.icon}>
                <WifiRoundedIcon sx={{ color: iconColor || '#9B9B9B', fontSize: 56 }} />
            </div>
        </div>
    );
};

export default View;
