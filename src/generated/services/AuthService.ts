/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthStatusDto } from '../models/AuthStatusDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Auth Status
     * @returns AuthStatusDto 
     * @throws ApiError
     */
    public static authControllerStatus(): CancelablePromise<AuthStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/status',
        });
    }

    /**
     * Sign in using discord
     * @returns any 
     * @throws ApiError
     */
    public static authControllerDiscordSignin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/discord',
        });
    }

    /**
     * Sign in using discord (callback)
     * @returns any 
     * @throws ApiError
     */
    public static authControllerDiscordSigninCallback(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/discord/callback',
        });
    }

    /**
     * @returns any 
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/logout',
        });
    }

}
