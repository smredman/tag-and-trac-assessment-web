import { Observable } from "rxjs";
import { Shipment } from "../models/shipment.model";
import axios from 'axios';
import { getRequestHeaders } from "./authentication.service";

const baseUrl = 'http://localhost:8080/api/v1/shipments';

export default {
    api: {
        list: (): Observable<Shipment[]> => {
            return new Observable(obs => {
                axios.get(baseUrl, getRequestHeaders())
                    .then(res => {
                        obs.next(res.data);
                    })
                    .catch(err => {
                        obs.error(err);
                    })
                    .finally(() => {
                        obs.complete();
                    });
            });
        },
        create: (dto: Partial<Shipment>): Observable<Shipment> => {
            return new Observable(obs => {
                axios.post(baseUrl, dto, getRequestHeaders())
                    .then(res => {
                        obs.next(res.data);
                    })
                    .catch(err => {
                        obs.error(err);
                    })
                    .finally(() => {
                        obs.complete();
                    });
            });
        },
        patch: (id: string, dto: Partial<Shipment>): Observable<Shipment> => {
            return new Observable(obs => {
                axios.patch(`${baseUrl}/${id}`, dto, getRequestHeaders())
                    .then(res => {
                        obs.next(res.data);
                    })
                    .catch(err => {
                        obs.error(err);
                    })
                    .finally(() => {
                        obs.complete();
                    });
            });
        },
        remove: (id: string): Observable<Shipment> => {
            return new Observable(obs => {
                axios.delete(`${baseUrl}/${id}`, getRequestHeaders())
                    .then(res => {
                        obs.next(res.data);
                    })
                    .catch(err => {
                        obs.error(err);
                    })
                    .finally(() => {
                        obs.complete();
                    });
            });
        }
    }
};