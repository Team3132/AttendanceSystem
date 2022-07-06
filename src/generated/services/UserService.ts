/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attendance } from '../models/Attendance';
import type { Rsvp } from '../models/Rsvp';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Get the currently authenticated user.
     * @returns User 
     * @throws ApiError
     */
    public static userControllerMe(): CancelablePromise<User> {
        return __request(OpenAPI, {
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
    public static userControllerUpdate(
requestBody: UpdateUserDto,
): CancelablePromise<User> {
        return __request(OpenAPI, {
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
    public static userControllerRemove(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/me',
        });
    }

    /**
     * @returns Attendance 
     * @throws ApiError
     */
    public static userControllerMeAttendance(): CancelablePromise<Array<Attendance>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/me/attendance',
        });
    }

    /**
     * @returns Rsvp 
     * @throws ApiError
     */
    public static userControllerMeRsvp(): CancelablePromise<Array<Rsvp>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/me/rsvp',
        });
    }

    /**
     * @returns User 
     * @throws ApiError
     */
    public static userControllerUsers(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
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
    public static userControllerUser(
id: string,
): CancelablePromise<User> {
        return __request(OpenAPI, {
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
    public static userControllerUpdateUser(
id: string,
requestBody: UpdateUserDto,
): CancelablePromise<User> {
        return __request(OpenAPI, {
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
    public static userControllerRemoveUser(
id: string,
): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{id}',
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
    public static userControllerUserRsvPs(
id: string,
): CancelablePromise<Array<Rsvp>> {
        return __request(OpenAPI, {
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
    public static userControllerUserAttendance(
id: string,
): CancelablePromise<Array<Attendance>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{id}/attendance',
            path: {
                'id': id,
            },
        });
    }

}
