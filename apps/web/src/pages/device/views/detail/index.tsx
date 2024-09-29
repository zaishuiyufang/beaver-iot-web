import { useState, useMemo, useRef } from 'react';
import { Tabs, Tab } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Breadcrumbs, TabPanel } from '@/components';
import { BasicTable, EntityTable, type BasicTableInstance } from './components';
import './style.less';

export default () => {
    const basicRef = useRef<BasicTableInstance>(null);
    const tabs = useMemo(() => {
        return [
            {
                key: 'basic',
                label: 'Basic Information',
                // intlKey: '',
                component: <BasicTable ref={basicRef} />,
            },
            {
                key: 'entity',
                label: 'Entity Data',
                // intlKey: '',
                component: <EntityTable />,
            },
        ];
    }, []);
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
