/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AppService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * A simple hello world just for you.
     * @returns string
     * @throws ApiError
     */
    public appControllerHelloWorld(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }

}
