/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { API_Status } from '../models/API_Status';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TbaService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Returns API status, and TBA status information.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns API_Status Successful response
     * @throws ApiError
     */
    public getStatus(
        ifNoneMatch?: string,
    ): CancelablePromise<API_Status> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/status',
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

}
