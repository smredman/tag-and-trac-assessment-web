import './Login.scss';

import { 
    Card, 
    CardContent, 
    TextField, 
    Typography, 
    Grid, 
    Button} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import AuthSvc from '../../../services/authentication.service';
import { AccountType } from '../../../models/account.model';
import { FC, ReactElement, useState } from 'react';
import {set} from '../../../util/form-utils';

const LoginComponent: FC = (): ReactElement => {

    const nav = useNavigate();

    const [formState, setFormState] = useState({
        email: "",
        password: ""
    });

    const [formErrors, setFormErrors] = useState({
        email: false,
        password: false
    });

    const validateForm = (): boolean => {
        const errors = {
            email: false,
            password: false
        };
        let validForm = true;
        if (!formState.email) {
            errors.email = true;
            validForm = false;
        }
        if (!formState.password) {
            errors.password = true;
            validForm = false;
        }
        setFormErrors(errors);
        return validForm;
    }

    const loginClicked = () => {
        

        if (!validateForm()) return;

        AuthSvc.api.logIn({
            email: formState.email,
            password: formState.password
        }).subscribe({
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
    };

    return (

        <div>
            <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    className="outer-grid"
                    sx={{minHeight: 'calc(100vh - 64px)'}}>

                    <Grid item sx={{maxWidth: '600px', width: '100%'}}>
                        <Card>
                            <CardContent>
                                <Typography variant="h4" component="h4" className="text-center">
                                    Please Log In
                                </Typography>
                                <form className="d-block">
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('email', setFormState)} className="w-100" label="Email" type="email" variant="standard" />
                                        {
                                            (formErrors.email) ? <Typography color="error">Required field</Typography> : ""
                                        }
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('password', setFormState)} className="w-100" label="Password" type="password" variant="standard" />
                                        {
                                            (formErrors.password) ? <Typography color="error">Required field</Typography> : ""
                                        }
                                    </div>
                                    <div className="text-center mt-20">
                                        <Button variant="contained" onClick={loginClicked}>
                                            Log In
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
        </div>
    );

};

export default LoginComponent;