import { memo, useState } from 'react';
import { useMatches } from 'react-router';
import { Link } from 'react-router-dom';
import cls from 'classnames';
import {
    MenuList,
    MenuItem,
    Avatar,
    Popover,
    Stack,
    Tooltip,
    IconButton,
    type MenuItemProps,
} from '@mui/material';
import { MenuOpen as MenuOpenIcon, KeyboardArrowDown } from '@mui/icons-material';
import { Logo } from '@milesight/shared/src/components';
import './style.less';

interface Props {
    /** 导航菜单 */
    menus?: {
        name: string;
        path: string;
        icon?: React.ReactNode;
    }[];

    /** 点击 Logo 跳转地址，默认跳转 `/` */
    logoLinkTo?: string;

    /** 菜单点击事件 */
    onMenuClick?: MenuItemProps['onClick'];
}

const Sidebar: React.FC<Props> = memo(({ menus, logoLinkTo = '/' }) => {
    const routes = useMatches().slice(1);
    const selectedKeys = routes.map(route => route.pathname);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLDivElement | null>(null);
    const [shrink, setShrink] = useState(false);

    return (
        <div className={cls('ms-layout-left ms-sidebar', { 'ms-sidebar-shrink': shrink })}>
            <Logo className="ms-sidebar-logo" to="/" mini={shrink} />
            <MenuList className="ms-sidebar-menus">
                {menus?.map(menu => (
                    <MenuItem
                        key={menu.path}
                        className="ms-sidebar-menu-item"
                        selected={selectedKeys.includes(menu.path)}
                    >
                        <Link className="ms-sidebar-menu-item-link" to={menu.path}>
                            {!shrink ? (
                                menu.icon
                            ) : (
                                <Tooltip arrow placement="right" title={menu.name}>
                                    {menu.icon as React.ReactElement}
                                </Tooltip>
                            )}
                            <span className="ms-name">{menu.name}</span>
                        </Link>
                    </MenuItem>
                ))}
            </MenuList>
            <div className="ms-sidebar-footer">
                <div className="ms-sidebar-user">
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        className={cls('ms-sidebar-user-trigger', { active: !!userMenuAnchorEl })}
                        onClick={e => setUserMenuAnchorEl(e.currentTarget)}
                    >
                        <Avatar
                            alt="avatar"
                            src="https://mui.com/static/images/avatar/3.jpg"
                            sx={{ width: 32, height: 32 }}
                        />
                        <span className="ms-name">Admin</span>
                        <KeyboardArrowDown className="ms-icon" />
                    </Stack>
                    <Popover
                        open={!!userMenuAnchorEl}
                        anchorEl={userMenuAnchorEl}
                        anchorOrigin={{
                            vertical: -10,
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        onClose={() => setUserMenuAnchorEl(null)}
                    >
                        <p>UserMenu</p>
                    </Popover>
                </div>
                <IconButton className="ms-oprt-shrink" onClick={() => setShrink(!shrink)}>
                    <MenuOpenIcon />
                </IconButton>
            </div>
        </div>
    );
});

export default Sidebar;
