import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
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
                    <Tab disableRipple title="Integration" label="Integration" value="1" />
                </Tabs>
                <div className="ms-tab-content">
                    <TabPanel value={tab} index="1">
                        <Integration />
                    </TabPanel>
                </div>
            </div>
        </div>
    );
}

export default App;
