import { useMemo, useState, useCallback, useEffect } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';

import { useI18n } from '@milesight/shared/src/hooks';
import Switch from '@/plugin/components/switch';

import { entityAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';

import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType;
        switchText?: string;
        offIcon?: string;
        offIconColor?: string;
        onIcon?: string;
        onIconColor?: string;
    };
    configJson: {
        isPreview?: boolean;
    };
}

const View = (props: ViewProps) => {
    const { config, configJson } = props;
    const { entity, switchText, onIconColor, offIconColor, offIcon, onIcon } = config || {};
    const { isPreview } = configJson || {};

    const { getIntlText } = useI18n();
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    /**
     * 获取所选实体的状态
     */
    useEffect(() => {
        (async () => {
            if (entity) {
                const [error, res] = await awaitWrap(
                    entityAPI.getEntityStatus({ id: entity.value }),
                );

                if (error || !isRequestSuccess(res)) {
                    /**
                     * 请求失败，以关闭 false 为默认值
                     */
                    setIsSwitchOn(false);
                    return;
                }

                const entityStatus = getResponseData(res);
                setIsSwitchOn(Boolean(entityStatus?.value));
            }
        })();
    }, [entity]);

    /**
     * 切换 switch 状态时，
     * 更新所选实体的状态数据
     */
    const handleEntityStatus = useCallback(
        async (switchVal: boolean) => {
            const entityKey = entity?.rawData?.entityKey;

            /**
             * 非预览状态，则可以进行数据更新
             */
            if (!entityKey || Boolean(isPreview)) return;

            entityAPI.updateProperty({
                exchange: { [entityKey]: switchVal },
            });
        },
        [entity, isPreview],
    );

    const handleSwitchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, val: boolean) => {
            setIsSwitchOn(val);

            handleEntityStatus(val);
        },
        [handleEntityStatus],
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
