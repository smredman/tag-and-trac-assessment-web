import { Button, Card, CardContent, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BaseSyntheticEvent, FC, ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountType } from "../../../models/account.model";
import AuthSvc from '../../../services/authentication.service';
import { set } from '../../../util/form-utils';

const RegisterComponent: FC = (): ReactElement => {

    const nav = useNavigate();

    const [formState, setFormState] = useState({
        businessName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: AccountType.Customer
    });

    const [formErrors, setFormErrors] = useState({
        businessName: false,
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
        accountType: false
    });

    const validateForm = (): boolean => {
        const errors = {
            businessName: false,
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false,
            accountType: false
        };
        let validForm = true;
        if (!formState.businessName) {
            errors.businessName = true;
            validForm = false;
        }
        if (!formState.firstName) {
            errors.firstName = true;
            validForm = false;
        }
        if (!formState.lastName) {
            errors.lastName = true;
            validForm = false;
        }
        if (!formState.email) {
            errors.email = true;
            validForm = false;
        }
        if (!formState.password) {
            errors.password = true;
            validForm = false;
        }
        if (!formState.confirmPassword || formState.confirmPassword !== formState.password) {
            errors.confirmPassword = true;
            validForm = false;
        }
        if (!formState.accountType) {
            errors.accountType = true;
            validForm = false;
        }
        setFormErrors(errors);
        return validForm;
    };

    const formSubmitted = (e: BaseSyntheticEvent) => {
        e.preventDefault();
       
        if (!validateForm()) return;

        AuthSvc.api.register({
            account: {
                name: formState.businessName,
                type: formState.accountType
            },
            user: {
                firstName: formState.firstName,
                lastName: formState.lastName,
                email: formState.email
            },
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

        return false;
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
                                    Please Register
                                </Typography>
                                <form className="d-block" onSubmit={formSubmitted}>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('businessName', setFormState)} className="w-100" label="Business Name" type="text" variant="standard" />
                                        {
                                            (formErrors.businessName) ? <Typography color="error">Required field</Typography> : ""
                                        }
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('firstName', setFormState)} className="w-100" label="First Name" type="text" variant="standard" />
                                        {
                                            (formErrors.firstName) ? <Typography color="error">Required field</Typography> : ""
                                        }
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('lastName', setFormState)} className="w-100" label="Last Name" type="text" variant="standard" />
                                        {
                                            (formErrors.lastName) ? <Typography color="error">Required field</Typography> : ""
                                        }
                                    </div>
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
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('confirmPassword', setFormState)} className="w-100" label="Confirm Password" type="password" variant="standard" />
                                        {
                                            (formErrors.confirmPassword) ? <Typography color="error">Passwords must match</Typography> : ""
                                        }
                                    </div>
                                    <div className="d-block mt-20">
                                        <InputLabel>Account Type</InputLabel>
                                        <Select onChange={set('accountType', setFormState)} className="w-100" variant="standard" value="customer">
                                            <MenuItem value="customer">Shipping Customer</MenuItem>
                                            <MenuItem value="delivery-partner">Delivery Partner</MenuItem>
                                        </Select>
                                        {
                                            (formErrors.accountType) ? <Typography color="error">Required field</Typography> : ""
                                        }
                                    </div>
                                    <div className="text-center mt-20">
                                        <Button variant="contained" type="submit">
                                            Register
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

export default RegisterComponent;