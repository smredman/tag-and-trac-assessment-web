import { FC, ReactElement, useEffect, useState } from "react";
import { User } from "../../../models/user.model";
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import { MenuItem, Select, TextField, Typography, InputLabel } from "@mui/material";
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

const ActiveOrdersComponent: FC<{ user: User }> = ({ user }): ReactElement => {

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
                id: 'h',
                label: 'Delivery Partner',
                type: 'text',
                key: 'partner'
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
                id: 'i',
                label: 'Created',
                type: 'text',
                key: 'createdAt'
            },
            {
                id: 'j',
                label: 'Updated',
                type: 'text',
                key: 'updatedAt'
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
            setEditMode(true);
            setTargetShipment(row);
            openModal();
        }
    });

    const [deliveryPartners, setDeliveryPartners] = useState([]);

    const [formState, setFormState] = useState({
        pickupLocation: "",
        dropOffLocation: "",
        totalItems: 0,
        combinedItemWeight: 0,
        itemsDescription: "",
        deliveryPartnerAccountId: ""
    });

    const [modalTitle, setModalTitle] = useState("Create a New Shipment");
    const [editMode, setEditMode] = useState(false);
    const [targetShipment, setTargetShipment] = useState({} as Partial<Shipment>);

    useEffect(() => {
        DeliveryPartnersSvc.api.listDeliveryPartners().subscribe({
            next: res => {
                setDeliveryPartners(res);
            },
            error: err => {
                console.log(err);
            }
        });

        listShipments();
    }, []);


    const submitShipment = () => {
        const shipment = formState;
        if (!editMode) {
            ShipmentsSvc.api.create(shipment).subscribe({
                next: res => {
                    closeModal();
                    listShipments();
                },
                error: err => {
                    console.log(err);
                }
            });
        }
        else {
            ShipmentsSvc.api.patch(targetShipment.id, shipment).subscribe({
                next: res => {
                    closeModal();
                    listShipments();
                },
                error: err => {
                    console.log(err);
                }
            });
        }
    };

    const listShipments = () => {
        ShipmentsSvc.api.list().subscribe({
            next: res => {
                res.forEach(item => {
                    item["partner"] = item["deliveryPartner"].name;
                });
                setTableConfig({ ...tableConfig, data: res});
            },
            error: err => {
                console.log(err);
            }
        })
    };

    const showNewShipmentModal = () => {
        setFormState({
            pickupLocation: "",
            dropOffLocation: "",
            totalItems: 0,
            combinedItemWeight: 0,
            itemsDescription: "",
            deliveryPartnerAccountId: ""
        });
        setEditMode(false);
        setModalTitle("Create a New Shipment");
        openModal();
    };

    const deleteShipment = () => {
        ShipmentsSvc.api.remove(targetShipment.id).subscribe({
            next: res => {
                closeModal();
                listShipments();
            },
            error: err => {
                console.log(err);
            }
        });
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
                <span className="flex-fill"></span>
                <Button variant="contained" color="secondary" onClick={showNewShipmentModal}>
                    <Add />
                    New Shipment
                </Button>
            </div>

            <CustomTable config={tableConfig} />

            <Modal open={modalOpen} onClose={closeModal}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        {modalTitle}
                    </Typography>
                    <form className="d-block w-100">
                        <div className="mt-20">
                            <TextField onChange={set('pickupLocation')} className="w-100" label="Pick-Up Location" value={formState.pickupLocation} />
                        </div>
                        <div className="mt-20">
                            <TextField onChange={set('dropOffLocation')} className="w-100" label="Drop-Off Location" value={formState.dropOffLocation} />
                        </div>
                        <div className="mt-20">
                            <TextField onChange={set('totalItems')} className="w-100" label="Total Items" value={formState.totalItems} />
                        </div>
                        <div className="mt-20">
                            <TextField onChange={set('combinedItemWeight')} className="w-100" label="Combined Item Weight (lbs)" value={formState.combinedItemWeight} />
                        </div>
                        <div className="mt-20">
                            <TextField onChange={set('itemsDescription')} multiline rows={10} className="w-100" label="Item(s) Description" value={formState.itemsDescription} />
                        </div>
                        <div className="mt-20">
                            <InputLabel>Delivery Partner</InputLabel>
                            <Select onChange={set('deliveryPartnerAccountId')} className="w-100" value={formState.deliveryPartnerAccountId}>
                                {
                                    deliveryPartners.map((p) => (
                                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="text-center mt-20">
                            {
                                (!editMode || editMode && targetShipment?.shipmentStatus === ShipmentStatus.Pending) ? <Button variant="text" color="secondary" onClick={submitShipment}>Submit</Button> : ""
                            }
                            <Button variant="text" className="ml-10" onClick={closeModal}>
                                Cancel
                            </Button>
                            <div className="mt-20">
                                {
                                    (editMode && targetShipment?.shipmentStatus === ShipmentStatus.Pending) ? <Button variant="contained" color="error" onClick={deleteShipment}>Delete</Button> : ""
                                }
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>

        </div>

    );

};

export default ActiveOrdersComponent;