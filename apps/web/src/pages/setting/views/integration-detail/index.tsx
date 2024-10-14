import { useMemo, useState } from 'react';
import { Stack, Tabs, Tab } from '@mui/material';
import { Logo, DevicesOtherIcon, ShareIcon } from '@milesight/shared/src/components';
import { thousandSeparate } from '@milesight/shared/src/utils/tools';
import { Breadcrumbs, TabPanel } from '@/components';
import { Config, Functions } from './components';
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
                key: 'function',
                label: 'Available Functions',
                // intlKey: '',
                component: <Functions />,
            },
        ];
    }, []);
    const [tabKey, setTabKey] = useState<ApiKey>(tabs[0].key);

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-int-detail">
                <div className="ms-view-int-detail__header">
                    <div className="detail">
                        <Logo mini className="logo" />
                        <Stack direction="column">
                            <div className="title">
                                <h2>Information Detail</h2>
                                <div className="meta">
                                    <span className="meta-item">
                                        <DevicesOtherIcon />
                                        <span>{thousandSeparate(2214)}</span>
                                    </span>
                                    <span className="meta-item">
                                        <ShareIcon />
                                        <span>{thousandSeparate(5432)}</span>
                                    </span>
                                </div>
                            </div>
                            <p className="desc">This is an integrated description information.</p>
                        </Stack>
                    </div>
                    <Tabs
                        className="ms-tabs"
                        value={tabKey}
                        onChange={(_, value) => setTabKey(value)}
                    >
                        {tabs.map(({ key, label }) => (
                            <Tab key={key} value={key} title={label} label={label} />
                        ))}
                    </Tabs>
                </div>
                <div className="ms-view-int-detail__body">
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
