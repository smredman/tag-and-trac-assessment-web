import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AccountType } from "../../models/account.model";
import AuthSvc from '../../services/authentication.service';

const AuthComponent = () => {

    const nav = useNavigate();

    useEffect(() => {
        AuthSvc.api.refreshToken().subscribe({
            next: res => {
                AuthSvc.setAuth(res);
                if (res.account.type === AccountType.Customer) {
                    nav('/customers');
                }
                else {
                    nav('/partners');
                }
            },
            error: err => {
                console.log(err);
            }
        });
    });

    return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                            Tag & Trac
                        </Typography>
                        
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </Box>
    );

};

export default AuthComponent