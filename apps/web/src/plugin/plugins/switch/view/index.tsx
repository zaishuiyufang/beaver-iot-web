import { useMemo, useState, useCallback } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';

import { useI18n } from '@milesight/shared/src/hooks';
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
    const { entity, switchText, onIconColor, offIconColor, offIcon, onIcon } = config;

    const { getIntlText } = useI18n();
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
        return isSwitchOn
            ? getIntlText('dashboard.switch_title_on')
            : getIntlText('dashboard.switch_title_off');
    }, [isSwitchOn, getIntlText]);

    /**
     * Icon 组件
     */
    const IconComponent = useMemo(() => {
        const iconName = isSwitchOn ? onIcon : offIcon;
        if (!iconName) return null;

        const Icon = Reflect.get(Icons, iconName);
        if (!Icon) return null;

        return <Icon sx={{ color: iconColor || '#9B9B9B', fontSize: 56 }} />;
    }, [isSwitchOn, onIcon, offIcon, iconColor]);

    return (
        <div className={styles['switch-wrapper']}>
            <div className={styles.content}>
                <div className={styles.body}>
                    <Switch value={isSwitchOn} title={switchTitle} onChange={handleSwitchChange} />
                </div>
                <div className={styles.text}>{switchText || getIntlText('common.label.title')}</div>
            </div>
            <div className={styles.icon}>{IconComponent}</div>
        </div>
    );
};

export default View;
