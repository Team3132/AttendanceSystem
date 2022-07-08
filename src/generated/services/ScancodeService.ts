/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateScancodeDto } from '../models/CreateScancodeDto';
import type { Scancode } from '../models/Scancode';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ScancodeService {

    /**
     * @param requestBody 
     * @returns Scancode 
     * @throws ApiError
     */
    public static scancodeControllerCreate(
requestBody: CreateScancodeDto,
): CancelablePromise<Scancode> {
        return __request(OpenAPI, {
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
    public static scancodeControllerFindAll(): CancelablePromise<Array<Scancode>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/scancode',
        });
    }

    /**
     * @param id 
     * @returns Scancode 
     * @throws ApiError
     */
    public static scancodeControllerRemove(
id: string,
): CancelablePromise<Scancode> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/scancode/{id}',
            path: {
                'id': id,
            },
        });
    }

}
