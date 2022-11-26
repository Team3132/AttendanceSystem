/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Rsvp } from '../models/Rsvp';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UserService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns User
     * @throws ApiError
     */
    public userControllerMe(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/me',
        });
    }

    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public userControllerUpdate(
        requestBody: UpdateUserDto,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/user/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns User
     * @throws ApiError
     */
    public userControllerRemove(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/user/me',
        });
    }

    /**
     * @returns string
     * @throws ApiError
     */
    public userControllerUserMeAvatar(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/me/avatar',
        });
    }

    /**
     * @returns Rsvp
     * @throws ApiError
     */
    public userControllerMeRsvp(): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/me/rsvp',
        });
    }

    /**
     * @returns User
     * @throws ApiError
     */
    public userControllerRegenerateToken(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/user/me/regenerateToken',
        });
    }

    /**
     * @returns User
     * @throws ApiError
     */
    public userControllerUsers(): CancelablePromise<Array<User>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user',
        });
    }

    /**
     * @param id
     * @returns User
     * @throws ApiError
     */
    public userControllerUser(
        id: string,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public userControllerUpdateUser(
        id: string,
        requestBody: UpdateUserDto,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/user/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns User
     * @throws ApiError
     */
    public userControllerRemoveUser(
        id: string,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns User
     * @throws ApiError
     */
    public userControllerRegenerateUserToken(
        id: string,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/user/{id}/regenerateToken',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns Rsvp
     * @throws ApiError
     */
    public userControllerUserRsvPs(
        id: string,
    ): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/{id}/rsvp',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns string
     * @throws ApiError
     */
    public userControllerUserAvatar(
        id: string,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/{id}/avatar',
            path: {
                'id': id,
            },
        });
    }

}
