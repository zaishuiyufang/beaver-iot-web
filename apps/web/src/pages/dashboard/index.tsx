import { useState, useRef } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import {
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenIconExit,
    Add as AddIcon,
} from '@mui/icons-material';
import { TabPanel } from '@/components';
import DashboardContent from './components/dashboard-content';
import AddDashboard from './components/add-dashboard';
import './style.less';

const TSBS = [
    {
        name: 'my-dashboard',
        id: '111',
    },
];

export default () => {
    const [tabs, setTabs] = useState(TSBS);
    const [tabKey, setTabKey] = useState<string>(TSBS[0].id);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const containerRef = useRef<any>(null);

    // 切换dasboard页签
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabKey(newValue);
    };

    // 进入全屏
    const enterFullscreen = () => {
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
    };

    // 退出全屏
    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        setIsFullscreen(false);
    };

    // 显示新增dashboard弹框
    const showAddDashboard = () => {
        setShowAdd(true);
    };

    const handleCloseAdd = () => {
        setShowAdd(false);
    };

    const handleAdd = (data: AddDashboardProps) => {
        setShowAdd(false);
        setTabs([
            ...tabs,
            {
                name: data.name,
                id: new Date().getTime().toString()
            }
        ])
    };
    
    return (
        <div className="ms-main dashboard" ref={containerRef}>
            {!isFullscreen ? (
                <FullscreenIcon className="dashboard-fullscreen" onClick={enterFullscreen} />
            ) : (
                <FullscreenIconExit className="dashboard-fullscreen" onClick={exitFullscreen} />
            )}
            <div className="ms-view ms-view-dashboard">
                <Tabs className="ms-tabs" value={tabKey} onChange={handleChange}>
                    {tabs?.map(tabItem => {
                        return (
                            <Tab
                                disableRipple
                                title={tabItem.name}
                                label={tabItem.name}
                                value={tabItem.id}
                            />
                        );
                    })}
                    <AddIcon className="dashboard-add" onClick={showAddDashboard} />
                </Tabs>
                <div className="ms-tab-content">
                    {tabs?.map(tabItem => {
                        return (
                            <TabPanel value={tabKey} index={tabItem.id}>
                                <DashboardContent />
                            </TabPanel>
                        );
                    })}
                </div>
            </div>
            {showAdd && <AddDashboard onCancel={handleCloseAdd} onOk={handleAdd} data={{ name: '111' }} />}
        </div>
    );
};
