/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthStatusDto } from '../models/AuthStatusDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get auth status
     * @returns AuthStatusDto
     * @throws ApiError
     */
    public authStatus(): CancelablePromise<AuthStatusDto> {
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
    public discordSignin(): CancelablePromise<any> {
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
    public discordSigninCallback(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/discord/callback',
        });
    }

    /**
     * Sign out
     * @returns any
     * @throws ApiError
     */
    public signout(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/logout',
        });
    }

}
