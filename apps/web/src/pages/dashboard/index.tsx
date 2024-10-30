import { useState, useRef, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import {
    FullscreenIcon,
    FullscreenExitIcon as FullscreenIconExit,
    AddIcon,
} from '@milesight/shared/src/components';
import { dashboardAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { DashboardDetail } from '@/services/http/dashboard';
import { TabPanel } from '@/components';
import DashboardContent from './components/dashboard-content';
import AddDashboard from './components/add-dashboard';
import './style.less';

export default () => {
    const [tabs, setTabs] = useState<DashboardDetail[]>([]);
    const [tabKey, setTabKey] = useState<ApiKey>();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const containerRef = useRef<any>(null);

    const getDashboards = async () => {
        const [_, res] = await awaitWrap(dashboardAPI.getDashboards());
        if (isRequestSuccess(res)) {
            const data = getResponseData(res);
            setTabs(data || []);
            // 没有选择则默认选中第一个
            if (!tabKey) {
                setTabKey(data?.[0]?.dashboard_id || '');
            } else {
                // 已选中判断当前选中是否还存在不存在默认选中第一个
                const isExist = data?.some((item: DashboardDetail) => item.dashboard_id === tabKey);
                if (!isExist) {
                    setTabKey(data?.[0]?.dashboard_id || '');
                }
            }
        }
    };

    useEffect(() => {
        getDashboards();
    }, []);

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

    // 添加dashboard
    const handleAdd = async (data: DashboardDetail) => {
        const [_, res] = await awaitWrap(dashboardAPI.addDashboard(data));
        if (isRequestSuccess(res)) {
            const resData: any = getResponseData(res);
            setTabs([...tabs, { ...data, dashboard_id: resData.dashboard_id, widgets: [] }]);
            setShowAdd(false);
        }
    };

    return (
        <div className="ms-main dashboard" ref={containerRef}>
            {!isFullscreen ? (
                <FullscreenIcon className="dashboard-fullscreen" onClick={enterFullscreen} />
            ) : (
                <FullscreenIconExit className="dashboard-fullscreen" onClick={exitFullscreen} />
            )}
            <div className="ms-view ms-view-dashboard">
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    className="ms-tabs"
                    value={tabKey}
                    onChange={handleChange}
                    sx={{
                        '& .MuiTabs-scrollButtons': {
                            '&.Mui-disabled': {
                                width: 0, // 隐藏禁用的滚动按钮
                            },
                        },
                        '& .MuiTabs-scrollButtons.Mui-disabled': {
                            display: 'none', // 完全隐藏禁用的滚动按钮
                        },
                    }}
                >
                    {tabs?.map(tabItem => {
                        return (
                            <Tab
                                key={tabItem.dashboard_id}
                                disableRipple
                                title={tabItem.name}
                                label={tabItem.name}
                                value={tabItem.dashboard_id}
                            />
                        );
                    })}
                    <AddIcon className="dashboard-add" onClick={showAddDashboard} />
                </Tabs>
                <div className="ms-tab-content">
                    {tabs?.map(tabItem => {
                        return (
                            <TabPanel
                                key={tabItem.dashboard_id}
                                value={tabKey || ''}
                                index={tabItem.dashboard_id}
                            >
                                <DashboardContent
                                    dashboardDetail={tabItem}
                                    getDashboards={getDashboards}
                                />
                            </TabPanel>
                        );
                    })}
                </div>
            </div>
            {showAdd && <AddDashboard onCancel={handleCloseAdd} onOk={handleAdd} />}
        </div>
    );
};
