import { useState, useEffect } from 'react';
import { Tabs, Tab, Toolbar } from '@mui/material';
import { AddIcon, toast } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';
import { dashboardAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { DashboardDetail } from '@/services/http/dashboard';
import { TabPanel } from '@/components';
import DashboardContent from './components/dashboard-content';
import AddDashboard from './components/add-dashboard';
import './style.less';

export default () => {
    const { getIntlText } = useI18n();
    const [tabs, setTabs] = useState<DashboardDetail[]>([]);
    const [tabKey, setTabKey] = useState<ApiKey>();
    const [showAdd, setShowAdd] = useState(false);

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
            toast.success(getIntlText('common.message.operation_success'));
        }
    };

    return (
        <div className="ms-main dashboard">
            <div className="ms-view ms-view-dashboard">
                <Toolbar className="dashboard-toolbar">
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
                        slotProps={{
                            endScrollButtonIcon: () => '111',
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
                    </Tabs>
                    <AddIcon className="dashboard-add" onClick={showAddDashboard} />
                </Toolbar>
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
