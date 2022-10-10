import { Account } from "../models/account.model";
import { User } from "../models/user.model";

export interface RegistrationRequestDto {
    account: Account;
    user: User;
    password: string;
}