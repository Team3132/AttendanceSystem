/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthStatusDto } from '../models/AuthStatusDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Auth Status
     * @returns AuthStatusDto 
     * @throws ApiError
     */
    public authControllerStatus(): CancelablePromise<AuthStatusDto> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/status',
        });
    }

    /**
     * Sign in using discord
     * @returns any 
     * @throws ApiError
     */
    public authControllerDiscordSignin(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/discord',
        });
    }

    /**
     * Sign in using discord (callback)
     * @returns any 
     * @throws ApiError
     */
    public authControllerDiscordSigninCallback(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/discord/callback',
        });
    }

    /**
     * @returns any 
     * @throws ApiError
     */
    public authControllerLogout(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/logout',
        });
    }

}
