import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import { useRequest } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { useRouteTab } from '@/hooks';
import { deviceAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import { Breadcrumbs, TabPanel } from '@/components';
import { BasicTable, EntityTable } from './components';
import './style.less';

export default () => {
    const { deviceId } = useParams();
    const { getIntlText } = useI18n();
    const {
        loading,
        data: deviceDetail,
        run: getDeviceDetail,
    } = useRequest(
        async () => {
            if (!deviceId) return;

            // TODO: 判断路由 state 中是否已有详情数据，若有则无需请求接口？
            // TODO: $ignoreError 为临时处理，待接口正常返回数据后删除
            const [error, resp] = await awaitWrap(deviceAPI.getDetail({ id: deviceId }));
            const data = getResponseData(resp);

            if (error || !data || !isRequestSuccess(resp)) return;

            return objectToCamelCase(data);
        },
        {
            debounceWait: 300,
            refreshDeps: [deviceId],
        },
    );

    // ---------- Tab 切换相关逻辑 ----------
    const tabs = useMemo(() => {
        return [
            {
                key: 'basic',
                label: getIntlText('device.detail.basic_info'),
                component: (
                    <BasicTable
                        data={deviceDetail}
                        loading={loading}
                        onEditSuccess={getDeviceDetail}
                    />
                ),
            },
            {
                key: 'entity',
                label: getIntlText('device.detail.entity_data'),
                component: <EntityTable data={deviceDetail} onRefresh={getDeviceDetail} />,
            },
        ];
    }, [deviceDetail, loading, getIntlText, getDeviceDetail]);
    const [tabKey, setTabKey] = useRouteTab(tabs[0].key);

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
