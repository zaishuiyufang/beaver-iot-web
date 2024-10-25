import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import { useRequest } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { useRouteTab } from '@/hooks';
import {
    deviceAPI,
    awaitWrap,
    getResponseData,
    isRequestSuccess,
    type DeviceAPISchema,
} from '@/services/http';
import { Breadcrumbs, TabPanel } from '@/components';
import { BasicTable, EntityTable } from './components';
import './style.less';

const mockEntityList = (() => {
    const data: DeviceAPISchema['getDetail']['response']['entities'][0] = {
        id: 'sensor.am308.temperature',
        key: 'sensor.am308.temperature',
        name: 'AM308',
        type: 'EVENT',
        value_type: 'INT',
        value_attribute: {},
    };
    const types = ['EVENT', 'SERVICE', 'PROPERTY'];
    const dataTypes = ['STRING', 'BOOLEAN', 'INT', 'FLOAT', 'DOUBLE'] as const;

    return new Array(100).fill({ ...data }).map((item, index) => {
        return {
            ...item,
            id: `${item.id}-${index}`,
            name: `${item.name}-${index}`,
            type: types[index % 3],
            value_type: dataTypes[index % 5],
        } as typeof data;
    });
})();

const mockData: DeviceAPISchema['getDetail']['response'] = {
    id: 11,
    external_id: 22,
    name: 'AM308',
    create_at: 1727072105549,
    founder: 'System',
    integration_name: 'Milesight Development Platform',
    deletable: true,
    entities: mockEntityList,
};

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
            // const [error, resp] = await awaitWrap(
            //     deviceAPI.getDetail({ id: deviceId }, { $ignoreError: true }),
            // );

            // if (error || !isRequestSuccess(resp)) return;
            const data = mockData;

            return data && objectToCamelCase(data);
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
                component: <BasicTable data={deviceDetail} loading={loading} />,
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
