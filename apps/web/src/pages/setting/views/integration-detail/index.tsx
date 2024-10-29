import { useState, useMemo, useLayoutEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Stack, Tabs, Tab } from '@mui/material';
import { useRequest } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { DevicesOtherIcon, EntityIcon } from '@milesight/shared/src/components';
import { thousandSeparate, objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { useRouteTab } from '@/hooks';
import { Breadcrumbs, TabPanel } from '@/components';
import {
    integrationAPI,
    IntegrationAPISchema,
    awaitWrap,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import { Config, Functions } from './components';
import './style.less';

type TabKey = 'config' | 'function';
type TabItem = {
    key: TabKey;
    label: string;
    component: React.ReactNode;
};

const InformationDetail = () => {
    const { integrationId } = useParams();
    const { getIntlText } = useI18n();

    // ---------- 集成详情数据逻辑 ----------
    const { state } = useLocation();
    const [basicInfo, setBasicInfo] =
        useState<ObjectToCamelCase<IntegrationAPISchema['getList']['response'][0]>>();
    const { data: entityList, refresh: refreshInteDetail } = useRequest(
        async () => {
            if (!integrationId) return;
            const [error, resp] = await awaitWrap(integrationAPI.getDetail({ id: integrationId }));
            const respData = getResponseData(resp);

            if (error || !respData || !isRequestSuccess(resp)) {
                return;
            }
            const data = objectToCamelCase(respData);

            setBasicInfo(data);
            return data.integrationEntities;
        },
        {
            debounceWait: 300,
            refreshDeps: [integrationId],
        },
    );

    useLayoutEffect(() => {
        if (!state?.id || state.id !== integrationId) return;
        setBasicInfo(state);
    }, [state, integrationId]);

    // ---------- Tab 相关逻辑 ----------
    const tabs = useMemo<TabItem[]>(() => {
        return [
            {
                key: 'config',
                label: getIntlText('setting.integration.configuration'),
                component: <Config entities={entityList} onUpdateSuccess={refreshInteDetail} />,
            },
            {
                key: 'function',
                label: getIntlText('setting.integration.available_function'),
                component: <Functions />,
            },
        ];
    }, [entityList, getIntlText, refreshInteDetail]);
    const [tabKey, setTabKey] = useRouteTab<TabKey>(tabs[0].key);

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-int-detail">
                <div className="ms-view-int-detail__header">
                    <div className="detail">
                        <div className="icon">
                            {!!basicInfo?.icon && <img src={basicInfo.icon} alt={basicInfo.name} />}
                        </div>
                        <Stack direction="column">
                            <div className="title">
                                <h2>{basicInfo?.name}</h2>
                                <div className="meta">
                                    <span className="meta-item">
                                        <DevicesOtherIcon />
                                        <span>
                                            {thousandSeparate(basicInfo?.deviceCount) || '-'}
                                        </span>
                                    </span>
                                    <span className="meta-item">
                                        <EntityIcon />
                                        <span>
                                            {thousandSeparate(basicInfo?.entityCount) || '-'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <p className="desc">{basicInfo?.description}</p>
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
