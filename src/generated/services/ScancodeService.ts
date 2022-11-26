/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateScancodeDto } from '../models/CreateScancodeDto';
import type { Scancode } from '../models/Scancode';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ScancodeService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param requestBody
     * @returns Scancode
     * @throws ApiError
     */
    public scancodeControllerCreate(
        requestBody: CreateScancodeDto,
    ): CancelablePromise<Scancode> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/scancode',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Scancode
     * @throws ApiError
     */
    public scancodeControllerFindAll(): CancelablePromise<Array<Scancode>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/scancode',
        });
    }

    /**
     * @param id
     * @returns Scancode
     * @throws ApiError
     */
    public scancodeControllerRemove(
        id: string,
    ): CancelablePromise<Scancode> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/scancode/{id}',
            path: {
                'id': id,
            },
        });
    }

}
