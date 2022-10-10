import { ReactElement, FC, useEffect } from "react";
import { User } from "../../models/user.model";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import HistoryIcon from '@mui/icons-material/History';
import ListIcon from '@mui/icons-material/List';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import AuthSvc from '../../services/authentication.service';
import { AccountType } from "../../models/account.model";
import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropdownIcon from '@mui/icons-material/ArrowDropDown';

const CustomersComponent: FC<{ user: User }> = ({ user }): ReactElement => {

    const nav = useNavigate();

    useEffect(() => {
        if (!AuthSvc.getUser() || AuthSvc.getUser().account.type !== AccountType.Customer) {
            nav('/');
        }
    });

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = (action: string) => {
        setAnchorEl(null);
        if (action === 'logout') {
            AuthSvc.api.logOut();
            nav('/');
        }
    };

    const drawerWidth = 240;

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography component="span">
                    Customer Portal
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                <ListItem>
                    <ListItemButton component={Link} to="active-orders">
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary="Active Orders" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window.document.body;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Tag & Trac
                    </Typography>
                    <span className="flex-fill"></span>
                    <Button onClick={handleOpenMenu} color="inherit" variant="text">
                        Steven Redman
                        <ArrowDropdownIcon />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => handleCloseMenu('profile')}>Profile</MenuItem>
                        <MenuItem onClick={() => handleCloseMenu('my-account')}>My Account</MenuItem>
                        <MenuItem onClick={() => handleCloseMenu('logout')}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
               
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />

                <Outlet />

            </Box>
        </Box>
    );

};

export default CustomersComponent;