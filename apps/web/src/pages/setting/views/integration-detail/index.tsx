import { useMemo, useState } from 'react';
import { Stack, Tabs, Tab } from '@mui/material';
import { DevicesOther as DevicesOtherIcon, Share as ShareIcon } from '@mui/icons-material';
import { Logo } from '@milesight/shared/src/components';
import { Breadcrumbs, TabPanel } from '@/components';
import { Config } from './components';
import './style.less';

const InformationDetail = () => {
    const tabs = useMemo(() => {
        return [
            {
                key: 'config',
                label: 'Integration Configuration',
                // intlKey: '',
                component: <Config />,
            },
            {
                key: 'service',
                label: 'Available Services',
                // intlKey: '',
                component: 'Available Services',
            },
            {
                key: 'function',
                label: 'Available Functions',
                // intlKey: '',
                component: 'Available Functions',
            },
        ];
    }, []);
    const [tabKey, setTabKey] = useState<ApiKey>(tabs[0].key);

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-int-detail">
                <div className="ms-view-int-detail__header">
                    <Logo mini className="logo" />
                    <Stack direction="column">
                        <div className="title">
                            <h2>Information Detail</h2>
                            <div className="meta">
                                <span className="meta-item">
                                    <DevicesOtherIcon />
                                    <span>3</span>
                                </span>
                                <span className="meta-item">
                                    <ShareIcon />
                                    <span>2</span>
                                </span>
                            </div>
                        </div>
                        <p className="desc">This is an integrated description information.</p>
                    </Stack>
                </div>
                <div className="ms-view-int-detail__body">
                    <div className="topbar">
                        <Tabs value={tabKey} onChange={(_, value) => setTabKey(value)}>
                            {tabs.map(({ key, label }) => (
                                <Tab
                                    disableRipple
                                    key={key}
                                    value={key}
                                    title={label}
                                    label={label}
                                />
                            ))}
                        </Tabs>
                    </div>
                    <div className="content">
                        {tabs.map(({ key, component }) => (
                            <TabPanel value={tabKey} index={key} key={key}>
                                {component}
                            </TabPanel>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InformationDetail;
