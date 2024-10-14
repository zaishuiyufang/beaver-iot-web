import { useState, useRef } from 'react';
import { Button, Popover } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import AddWidget from '../add-widget';
import PluginList from '../plugin-list';
import PluginListClass from '../plugin-list-class';
import AddCustomerWidget from '../custom-widget';
import Widgets from '../widgets';

export default () => {
    const { getIntlText } = useI18n();
    const [isShowAddWidget, setIsShowAddWidget] = useState(false);
    const [widgets, setWidgets] = useState<any[]>([]);
    const [plugin, setPlugin] = useState<CustomComponentProps>();
    const [showCustom, setShowCustom] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);
    const widgetsRef = useRef<any[]>([]);

    const handleShowAddWidget = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsShowAddWidget(true);
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAddWidgetPopover = () => {
        setIsShowAddWidget(false);
        setAnchorEl(null);
    };

    const handleSelectPlugin = (type: CustomComponentProps) => {
        setPlugin(type);
    };

    const closeAddWidget = () => {
        setPlugin(undefined);
    };

    const handleChangeWidgets = (data: any) => {
        console.log(data);
        setWidgets(data);
    };

    const handleOk = (data: any) => {
        const newWidgets = [...widgets];
        const index = newWidgets.findIndex((item: any) => item.id === data.id);
        if (index > -1 && data?.id) {
            newWidgets[index] = data;
        } else {
            newWidgets.push(data);
        }
        widgetsRef.current = cloneDeep(newWidgets);
        handleChangeWidgets(newWidgets);
    };

    const handleShowAddCustomWidget = () => {
        setShowCustom(true);
    };

    const closeAddCustomWidget = () => {
        setShowCustom(false);
    };

    // 进入dashboard编辑状态
    const changeEditStatus = () => {
        setIsEdit(true);
    };

    // 退出dashboard编辑状态
    const cancelEditStatus = () => {
        setIsEdit(false);
        const newWidgets = cloneDeep(widgetsRef.current);
        setWidgets(newWidgets);
    };

    // 编辑dashboard保存
    const saveEditDashboard = () => {
        widgetsRef.current = cloneDeep(widgets);
        setIsEdit(false);
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-content-operate">
                <div className="dashboard-content-operate-left">
                    {isEdit || !widgets.length ? (
                        <>
                            <Button variant="contained" onClick={handleShowAddWidget}>
                                {getIntlText('dashboard.add_widget')}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleShowAddCustomWidget}
                                sx={{ marginLeft: '20px' }}
                            >
                                添加自定义组件
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={changeEditStatus}>
                            {getIntlText('common.button.edit')}
                        </Button>
                    )}
                </div>
                {isEdit && (
                    <div className="dashboard-content-operate-right">
                        <Button variant="outlined" onClick={handleShowAddWidget}>
                            {getIntlText('common.label.delete')}
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ marginLeft: '20px' }}
                            onClick={cancelEditStatus}
                        >
                            {getIntlText('common.button.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={saveEditDashboard}
                            sx={{ marginLeft: '20px' }}
                        >
                            {getIntlText('common.button.save')}
                        </Button>
                    </div>
                )}
            </div>
            {!!plugin && <AddWidget plugin={plugin} onCancel={closeAddWidget} onOk={handleOk} />}
            {!widgets?.length ? (
                <div className="dashboard-content-empty">
                    <div className="dashboard-content-empty-title">
                        {getIntlText('dashboard.empty_text')}
                    </div>
                    <div className="dashboard-content-empty-description">
                        {getIntlText('dashboard.empty_description')}
                    </div>
                    <PluginList onSelect={handleSelectPlugin} />
                </div>
            ) : (
                <div className="dashboard-content-main" ref={mainRef}>
                    <DndProvider backend={HTML5Backend}>
                        <Widgets
                            parentRef={mainRef}
                            widgets={widgets}
                            onChangeWidgets={handleChangeWidgets}
                            isEdit={isEdit}
                            onEdit={handleSelectPlugin}
                        />
                    </DndProvider>
                </div>
            )}
            {!!showCustom && <AddCustomerWidget onCancel={closeAddCustomWidget} />}
            <Popover
                open={isShowAddWidget}
                anchorEl={anchorEl}
                onClose={handleCloseAddWidgetPopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <PluginListClass onSelect={handleSelectPlugin} />
            </Popover>
        </div>
    );
};
