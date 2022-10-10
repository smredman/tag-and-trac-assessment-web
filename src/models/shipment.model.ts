import { DbModel } from "./dbmodel.model";

export enum ShipmentStatus {
    Pending = "pending",
    PickedUp = "picked-up",
    OutForDelivery = "out-for-delivery",
    Delivered = "delivered"
}

export interface Shipment extends DbModel {
    pickupLocation: string;
    dropOffLocation: string;
    totalItems: number;
    combinedItemWeight:number;
    itemsDescription: string;
    shipmentStatus: ShipmentStatus;
    deliveryPartnerAccountId: string;
    customerAccountId: string;
}