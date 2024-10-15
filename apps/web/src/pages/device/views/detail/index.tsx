import { useState, useMemo, useRef } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { Breadcrumbs, TabPanel } from '@/components';
import { BasicTable, EntityTable, type BasicTableInstance } from './components';
import './style.less';

export default () => {
    const { getIntlText } = useI18n();
    const basicRef = useRef<BasicTableInstance>(null);
    const tabs = useMemo(() => {
        return [
            {
                key: 'basic',
                label: getIntlText('device.detail.basic_info'),
                component: <BasicTable ref={basicRef} />,
            },
            {
                key: 'entity',
                label: getIntlText('device.detail.entity_data'),
                component: <EntityTable />,
            },
        ];
    }, [getIntlText]);
    const [tabKey, setTabKey] = useState<ApiKey>(tabs[0].key);

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-device-detail">
                <div className="topbar">
                    <Tabs
                        className="ms-tabs"
                        value={tabKey}
                        onChange={(_, value) => setTabKey(value)}
                    >
                        {tabs.map(({ key, label }) => (
                            <Tab disableRipple key={key} value={key} title={label} label={label} />
                        ))}
                    </Tabs>
                </div>
                <div className="ms-tab-content">
                    {tabs.map(({ key, component }) => (
                        <TabPanel value={tabKey} index={key} key={key}>
                            {component}
                        </TabPanel>
                    ))}
                </div>
            </div>
        </div>
    );
};
