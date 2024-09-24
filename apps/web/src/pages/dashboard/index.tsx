import { useState, useRef } from 'react';
import { TextField, Button, Tabs, Tab } from '@mui/material';
import { Fullscreen as FullscreenIcon, FullscreenExit as FullscreenIconExit } from '@mui/icons-material';
import { TabPanel } from '@/components';
import DashboardContent from './components/dashboard-content.tsx';
import './style.less';

const TSBS = [{
    name: "my-dashboard",
    id: "111"
}]

export default () => {
    const [tabs, setTabs] = useState(TSBS);
    const [tabKey, setTabKey] = useState<string>(TSBS[0].id);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<any>(null);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabKey(newValue);
    };

    const enterFullscreen = () => {
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        setIsFullscreen(false);
    };

    return (
        <div className="ms-main dashboard" ref={containerRef}>
            {
                !isFullscreen ? (
                    <FullscreenIcon className="dashboard-fullscreen" onClick={enterFullscreen} />
                ) : <FullscreenIconExit className="dashboard-fullscreen" onClick={exitFullscreen} />
            }
            <div className="ms-view ms-view-dashboard">
                <Tabs className="ms-tabs" value={tabKey} onChange={handleChange}>
                    {
                        tabs?.map((tabItem) => {
                            return (
                                <Tab disableRipple title={tabItem.name} label={tabItem.name} value={tabItem.id} />
                            )
                        })
                    }
                </Tabs>
                <div className="ms-tab-content">
                    {
                        tabs?.map((tabItem) => {
                            return (
                                <TabPanel value={tabKey} index={tabItem.id}>
                                    <DashboardContent />
                                </TabPanel>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};
