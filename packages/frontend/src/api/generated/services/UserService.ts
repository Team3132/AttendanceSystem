/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateScancodeDto } from '../models/CreateScancodeDto';
import type { Rsvp } from '../models/Rsvp';
import type { RsvpEvent } from '../models/RsvpEvent';
import type { Scancode } from '../models/Scancode';
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
    public getMe(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/me',
        });
    }

    /**
     * Edit the signed-in user.
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public editMe(
        requestBody: UpdateUserDto,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/user/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete the signed in user.
     * @returns User
     * @throws ApiError
     */
    public deleteMe(): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/user/me',
        });
    }

    /**
     * Get a specific user.
     * @param id
     * @returns User
     * @throws ApiError
     */
    public getUser(
        id: string,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}',
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
    public editUser(
        id: string,
        requestBody: UpdateUserDto,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/user/{id}',
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
    public deleteUser(
        id: string,
    ): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get the currently authenticated user's avatar id
     * @returns string
     * @throws ApiError
     */
    public getMeAvatar(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/me/avatar',
        });
    }

    /**
     * Get a user's discord avatar id
     * @param id
     * @returns string
     * @throws ApiError
     */
    public getUserAvatar(
        id: string,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/avatar',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get the RSVPs of the logged in user.
     * @returns Rsvp
     * @throws ApiError
     */
    public getMeRsvPs(): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/me/rsvp',
        });
    }

    /**
     * Get a user's RSVPs
     * @param id
     * @returns Rsvp
     * @throws ApiError
     */
    public getUserRsvPs(
        id: string,
    ): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/rsvp',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get a list of all users.
     * @returns User
     * @throws ApiError
     */
    public getUsers(): CancelablePromise<Array<User>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user',
        });
    }

    /**
     * Get a list of the logged in user's scancodes.
     * @returns Scancode
     * @throws ApiError
     */
    public getMeScancodes(): CancelablePromise<Array<Scancode>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/me/scancodes',
        });
    }

    /**
     * Create a scancode for the logged in user.
     * @param requestBody
     * @returns Scancode
     * @throws ApiError
     */
    public createMeScancode(
        requestBody: CreateScancodeDto,
    ): CancelablePromise<Scancode> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/user/me/scancodes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a list of the specified user's scancodes.
     * @param id
     * @returns Scancode
     * @throws ApiError
     */
    public getUserScancodes(
        id: string,
    ): CancelablePromise<Array<Scancode>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/scancodes',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Create a scancode for the specified user.
     * @param id
     * @param requestBody
     * @returns Scancode
     * @throws ApiError
     */
    public createUserScancode(
        id: string,
        requestBody: CreateScancodeDto,
    ): CancelablePromise<Scancode> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/user/{id}/scancodes',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a scancode for the logged in user.
     * @param scancodeId
     * @returns Scancode
     * @throws ApiError
     */
    public deleteMeScancode(
        scancodeId: string,
    ): CancelablePromise<Scancode> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/user/me/scancodes/{scancodeId}',
            path: {
                'scancodeId': scancodeId,
            },
        });
    }

    /**
     * Delete a scancode for the specified user.
     * @param id
     * @param scancodeId
     * @returns Scancode
     * @throws ApiError
     */
    public deleteUserScancode(
        id: string,
        scancodeId: string,
    ): CancelablePromise<Scancode> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/user/{id}/scancodes/{scancodeId}',
            path: {
                'id': id,
                'scancodeId': scancodeId,
            },
        });
    }

    /**
     * Get the currently pending RSVPs of the logged in user.
     * @returns RsvpEvent
     * @throws ApiError
     */
    public getMePendingRsvPs(): CancelablePromise<Array<RsvpEvent>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/me/rsvp/pending',
        });
    }

    /**
     * Get the currently pending RSVPs of the specified user.
     * @param id
     * @returns RsvpEvent
     * @throws ApiError
     */
    public getUserPendingRsvPs(
        id: string,
    ): CancelablePromise<Array<RsvpEvent>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/rsvp/pending',
            path: {
                'id': id,
            },
        });
    }

}
