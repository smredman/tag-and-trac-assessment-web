import { Observable } from "rxjs";
import axios from 'axios';
import { Account } from "../models/account.model";
import AuthSvc from './authentication.service';
import { getRequestHeaders } from "./authentication.service";

const baseUrl = 'http://localhost:8080/api/v1/delivery-partners';

export default {
    api: {
        listDeliveryPartners: (): Observable<Account[]> => {
            return new Observable(obs => {
                axios.get(baseUrl, getRequestHeaders())
                    .then(res => {
                        obs.next(res.data);
                    })
                    .catch (err => {
                        obs.error(err);
                    })
                    .finally(() => {
                        obs.complete();
                    });
            });
        }
    }
}