import { FC, ReactElement, useEffect, useState } from "react";
import { User } from "../../../models/user.model";
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import { MenuItem, Select, TextField, Typography, InputLabel, Input, TextareaAutosize } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import DeliveryPartnersSvc from '../../../services/delivery-partners.service';
import ShipmentsSvc from '../../../services/shipments.service';

import { CustomTable, TableConfig } from "../../../components/custom-table/CustomTable";
import { Shipment, ShipmentStatus } from "../../../models/shipment.model";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DeliveryPartnersActiveOrdersComponent: FC<{ user: User }> = ({ user }): ReactElement => {

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const [tableConfig, setTableConfig] = useState({
        dataKey: 'id',
        columns: [
            {
                id: 'a',
                label: 'Shipment ID',
                type: 'text',
                key: 'id'
            },
            {
                id: 'b',
                label: 'From',
                type: 'text',
                key: 'pickupLocation'
            },
            {
                id: 'c',
                label: 'To',
                type: 'text',
                key: 'dropOffLocation'
            },
            {
                id: 'd',
                label: 'Item Count',
                type: 'text',
                key: 'totalItems'
            },
            {
                id: 'e',
                label: 'Weight',
                type: 'text',
                key: 'combinedItemWeight'
            },
            {
                id: 'f',
                label: 'Status',
                type: 'text',
                key: 'shipmentStatus'
            },
            {
                id: 'g',
                label: 'View',
                type: 'actionButton'
            }
        ],
        data: [

        ],
        onActionBtnClick: (column: any, row: any) => {
            setFormState(row);
            setModalTitle('View/Edit Shipment');
            setTargetShipment(row);
            openModal();
        }
    });

    const [formState, setFormState] = useState({
        pickupLocation: "",
        dropOffLocation: "",
        totalItems: 0,
        combinedItemWeight: 0,
        itemsDescription: "",
        shipmentStatus: ShipmentStatus.Pending
    });

    const [modalTitle, setModalTitle] = useState("Create a New Shipment");
    const [targetShipment, setTargetShipment] = useState({} as Partial<Shipment>);

    useEffect(() => {
        listShipments();
    }, []);


    const submitShipment = () => {
        const shipment = formState;
        ShipmentsSvc.api.patch(targetShipment.id, shipment).subscribe({
            next: res => {
                closeModal();
                listShipments();
            },
            error: err => {
                console.log(err);
            }
        });
    };

    const listShipments = () => {
        ShipmentsSvc.api.list().subscribe({
            next: res => {
                setTableConfig({ ...tableConfig, data: res });
            },
            error: err => {
                console.log(err);
            }
        })
    };

    const set = name => {
        return ({ target: { value } }) => {
            setFormState(oldValues => ({ ...oldValues, [name]: value }));
        }
    };

    return (
        <div>
            <div className="d-flex">
                <Typography variant="h4">
                    Active Orders
                </Typography>
            </div>

            <CustomTable config={tableConfig} />

            <Modal open={modalOpen} onClose={closeModal}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        {modalTitle}
                    </Typography>
                    <form className="d-block w-100">
                        <div className="mt-20">
                            <InputLabel>Pick-up Location</InputLabel>
                            <Input className="w-100" readOnly={true} value={formState.pickupLocation} />
                        </div>
                        <div className="mt-20">
                            <InputLabel>Drop-off Location</InputLabel>
                            <Input className="w-100" readOnly={true} value={formState.dropOffLocation} />
                        </div>
                        <div className="mt-20">
                            <InputLabel>Total Items</InputLabel>
                            <Input className="w-100" readOnly={true} value={formState.totalItems} />
                        </div>
                        <div className="mt-20">
                            <InputLabel>Combined Item Weight (lbs)</InputLabel>
                            <Input className="w-100" readOnly={true} value={formState.combinedItemWeight} />
                        </div>
                        <div className="mt-20">
                            <InputLabel>Item(s) Description</InputLabel>
                            <TextareaAutosize maxRows={5} minRows={5} className="w-100" value={formState.itemsDescription} />
                        </div>
                        <div className="mt-20">
                            <Select className="w-100" onChange={set('shipmentStatus')} value={formState.shipmentStatus}>
                                <MenuItem value={ShipmentStatus.Pending}>Pending</MenuItem>
                                <MenuItem value={ShipmentStatus.PickedUp}>Picked-Up</MenuItem>
                                <MenuItem value={ShipmentStatus.OutForDelivery}>Out for Delivery</MenuItem>
                                <MenuItem value={ShipmentStatus.Delivered}>Delivered</MenuItem>
                            </Select>
                        </div>
                        <div className="text-center mt-20">
                            <Button variant="text" color="secondary" onClick={submitShipment}>Submit</Button>
                            <Button variant="text" className="ml-10" onClick={closeModal}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

        </div>

    );

};

export default DeliveryPartnersActiveOrdersComponent;