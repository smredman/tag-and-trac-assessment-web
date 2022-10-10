import { Button, Card, CardContent, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BaseSyntheticEvent, FC, ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountType } from "../../../models/account.model";
import AuthSvc from '../../../services/authentication.service';

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

    const set = name => {
        return ({ target: { value } }) => {
          setFormState(oldValues => ({...oldValues, [name]: value }));
        }
    };

    const formSubmitted = (e: BaseSyntheticEvent) => {
        e.preventDefault();
        console.log(formState);

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
                                        <TextField onChange={set('businessName')} className="w-100" label="Business Name" type="text" variant="standard" />
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('firstName')} className="w-100" label="First Name" type="text" variant="standard" />
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('lastName')} className="w-100" label="Last Name" type="text" variant="standard" />
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('email')} className="w-100" label="Email" type="email" variant="standard" />
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('password')} className="w-100" label="Password" type="password" variant="standard" />
                                    </div>
                                    <div className="d-block mt-10">
                                        <TextField onChange={set('confirmPassword')} className="w-100" label="Confirm Password" type="password" variant="standard" />
                                    </div>
                                    <div className="d-block mt-20">
                                        <InputLabel>Account Type</InputLabel>
                                        <Select onChange={set('accountType')} className="w-100" variant="standard">
                                            <MenuItem value="customer">Shipping Customer</MenuItem>
                                            <MenuItem value="delivery-partner">Delivery Partner</MenuItem>
                                        </Select>
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