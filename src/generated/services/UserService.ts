/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attendance } from '../models/Attendance';
import type { Rsvp } from '../models/Rsvp';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UserService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get the currently authenticated user.
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
     * Edit the signed-in user.
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
     * Delete the signed in user.
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
     * Get the currently authenticated user's avatar id
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
     * @returns Attendance 
     * @throws ApiError
     */
    public userControllerMeAttendance(): CancelablePromise<Array<Attendance>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/me/attendance',
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
     * Regenerates the calendar token of the signed in user.
     * @returns User 
     * @returns any 
     * @throws ApiError
     */
    public userControllerRegenerateToken(): CancelablePromise<User | any> {
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
     * Get a specific user.
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
     * Edit a user.
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
     * Delete a user.
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
     * Regenerates the calendar token of the specified user.
     * @param id 
     * @returns User 
     * @returns any 
     * @throws ApiError
     */
    public userControllerRegenerateUserToken(
id: string,
): CancelablePromise<User | any> {
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
     * @returns Attendance 
     * @throws ApiError
     */
    public userControllerUserAttendance(
id: string,
): CancelablePromise<Array<Attendance>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/user/{id}/attendance',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get a user's discord avatar id
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
