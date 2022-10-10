import { Account } from "../models/account.model";
import { User } from "../models/user.model";

export interface AuthenticationResponseDto {
    account: Account;
    user: User;
    jwt: string;
}