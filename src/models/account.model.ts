import { DbModel } from "./dbmodel.model";

export enum AccountType {
    Customer = "customer",
    DeliveryPartner = "delivery-partner"
}

export interface Account extends DbModel {
    name: string;
    type: AccountType;
}