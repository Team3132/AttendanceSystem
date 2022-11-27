/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CalendarService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Download calendar
     * @returns any
     * @throws ApiError
     */
    public downloadCalendar(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/calendar',
        });
    }

}
