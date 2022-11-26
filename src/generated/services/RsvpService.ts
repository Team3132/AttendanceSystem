/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRsvpDto } from '../models/CreateRsvpDto';
import type { Rsvp } from '../models/Rsvp';
import type { UpdateRsvpDto } from '../models/UpdateRsvpDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RsvpService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create an RSVP
     * @param requestBody
     * @returns Rsvp
     * @returns any
     * @throws ApiError
     */
    public rsvpControllerCreate(
        requestBody: CreateRsvpDto,
    ): CancelablePromise<Rsvp | any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/rsvp',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Rsvp
     * @throws ApiError
     */
    public rsvpControllerFindAll(): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/rsvp',
        });
    }

    /**
     * Get a specific RSVP
     * @param id
     * @returns Rsvp
     * @throws ApiError
     */
    public rsvpControllerFindOne(
        id: string,
    ): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/rsvp/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Edit a specific RSVP
     * @param id
     * @param requestBody
     * @returns Rsvp
     * @throws ApiError
     */
    public rsvpControllerUpdate(
        id: string,
        requestBody: UpdateRsvpDto,
    ): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/rsvp/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete an RSVP
     * @param id
     * @returns Rsvp
     * @throws ApiError
     */
    public rsvpControllerRemove(
        id: string,
    ): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/rsvp/{id}',
            path: {
                'id': id,
            },
        });
    }

}
