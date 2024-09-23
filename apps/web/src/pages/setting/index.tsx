import { useState } from 'react';
import { Button, Tabs, Tab } from '@mui/material';
import { toast } from '@milesight/shared/src/components';
import { Breadcrumbs, TabPanel } from '@/components';
import { Integration } from './components';
import './style.less';

function App() {
    const [tab, setTab] = useState<ApiKey>('1');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-setting">
                <Tabs className="ms-tabs" value={tab} onChange={handleChange}>
                    <Tab disableRipple title="Item One" label="Item One" value="1" />
                    <Tab disableRipple title="Item Two" label="Item Two" value="2" />
                    <Tab disableRipple title="Item Three" label="Item Three" value="3" />
                </Tabs>
                <div className="ms-tab-content">
                    <TabPanel value={tab} index="1">
                        <Integration />
                    </TabPanel>
                    <TabPanel value={tab} index="2">
                        Item 222
                    </TabPanel>
                    <TabPanel value={tab} index="3">
                        Item 333
                    </TabPanel>
                </div>
            </div>
        </div>
    );
}

export default App;
