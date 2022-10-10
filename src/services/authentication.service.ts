import { BehaviorSubject, Observable } from 'rxjs';
import { RegistrationRequestDto } from '../dtos/registration-request.dto';
import { User } from '../models/user.model';
import axios from 'axios';
import { AuthenticationResponseDto } from '../dtos/authentication-response.dto';
import { AuthenticationRequestDto } from '../dtos/authentication-request.dto';

const user$ = new BehaviorSubject<User>(null);
let user: User;

const baseUrl = 'http://localhost:8080/api/v1/';
const localStorageKey = 'tg-auth';

export const getRequestHeaders = () => {
    return {
        headers: {
            Authorization: localStorage.getItem(localStorageKey)
        }
    }
};

export default {
    observeUser: () => {
        return user$.asObservable();
    },
    setUser: (u: User) => {
        user = u;
        user$.next(user);
    },
    getUser: (): User => {
        return user;
    },
    setAuth: (data: AuthenticationResponseDto) => {
        localStorage.setItem(localStorageKey, data.jwt);
        const u: User = {...data.user, account: data.account};
        user = u;
        user$.next(user);
    },
    api: {
        register: (dto: RegistrationRequestDto): Observable<AuthenticationResponseDto> => {
            return new Observable(obs => {
                axios.post(`${baseUrl}registration`, dto)
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
        refreshToken: (): Observable<AuthenticationResponseDto> => {
            return new Observable(obs => {
                axios.get(`${baseUrl}auth/refresh`, getRequestHeaders())
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
        logIn: (dto: AuthenticationRequestDto): Observable<AuthenticationResponseDto> => {
            return new Observable(obs => {
                axios.post(`${baseUrl}auth/login`, dto)
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
        logOut: () => {
            localStorage.clear();
        }
    }
}