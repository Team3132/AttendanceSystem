/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRsvpDto } from '../models/CreateRsvpDto';
import type { Rsvp } from '../models/Rsvp';
import type { UpdateRsvpDto } from '../models/UpdateRsvpDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RsvpService {

    /**
     * Create an RSVP
     * @param requestBody 
     * @returns Rsvp 
     * @returns any 
     * @throws ApiError
     */
    public static rsvpControllerCreate(
requestBody: CreateRsvpDto,
): CancelablePromise<Rsvp | any> {
        return __request(OpenAPI, {
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
    public static rsvpControllerFindAll(): CancelablePromise<Array<Rsvp>> {
        return __request(OpenAPI, {
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
    public static rsvpControllerFindOne(
id: string,
): CancelablePromise<Rsvp> {
        return __request(OpenAPI, {
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
    public static rsvpControllerUpdate(
id: string,
requestBody: UpdateRsvpDto,
): CancelablePromise<Rsvp> {
        return __request(OpenAPI, {
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
    public static rsvpControllerRemove(
id: string,
): CancelablePromise<Rsvp> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rsvp/{id}',
            path: {
                'id': id,
            },
        });
    }

}
