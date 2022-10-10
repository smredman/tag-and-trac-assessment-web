import { Account } from "./account.model";
import { DbModel } from "./dbmodel.model";

export interface User extends DbModel {
    firstName: string;
    lastName: string;
    email: string;
    accountId?: string;

    account?: Account;
}