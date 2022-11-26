/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEventDto } from '../models/CreateEventDto';
import type { Event } from '../models/Event';
import type { Rsvp } from '../models/Rsvp';
import type { ScaninDto } from '../models/ScaninDto';
import type { UpdateEventDto } from '../models/UpdateEventDto';
import type { UpdateOrCreateRSVP } from '../models/UpdateOrCreateRSVP';
import type { UpdateRangeRSVP } from '../models/UpdateRangeRSVP';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EventService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param from
     * @param to
     * @param take
     * @returns Event
     * @throws ApiError
     */
    public eventControllerFindAll(
        from?: string,
        to?: string,
        take?: number,
    ): CancelablePromise<Array<Event>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event',
            query: {
                'from': from,
                'to': to,
                'take': take,
            },
        });
    }

    /**
     * @param requestBody
     * @returns Event
     * @throws ApiError
     */
    public eventControllerCreate(
        requestBody: CreateEventDto,
    ): CancelablePromise<Event> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns Event
     * @throws ApiError
     */
    public eventControllerFindOne(
        id: string,
    ): CancelablePromise<Event> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns Event
     * @throws ApiError
     */
    public eventControllerUpdate(
        id: string,
        requestBody: UpdateEventDto,
    ): CancelablePromise<Event> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/event/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns Event
     * @throws ApiError
     */
    public eventControllerRemove(
        id: string,
    ): CancelablePromise<Event> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/event/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param eventId
     * @returns Rsvp
     * @throws ApiError
     */
    public eventControllerGetEventRsvp(
        eventId: string,
    ): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{eventId}/rsvp',
            path: {
                'eventId': eventId,
            },
        });
    }

    /**
     * @param eventId
     * @param requestBody
     * @returns Rsvp
     * @throws ApiError
     */
    public eventControllerSetEventRsvp(
        eventId: string,
        requestBody: UpdateOrCreateRSVP,
    ): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event/{eventId}/rsvp',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns Rsvp
     * @throws ApiError
     */
    public eventControllerSetEventsRsvp(
        requestBody: UpdateRangeRSVP,
    ): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event/rsvps',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param eventId
     * @returns Rsvp
     * @throws ApiError
     */
    public eventControllerGetEventRsvps(
        eventId: string,
    ): CancelablePromise<Array<Rsvp>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{eventId}/rsvps',
            path: {
                'eventId': eventId,
            },
        });
    }

    /**
     * @param eventId
     * @param requestBody
     * @returns Rsvp
     * @throws ApiError
     */
    public eventControllerScanin(
        eventId: string,
        requestBody: ScaninDto,
    ): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event/{eventId}/scanin',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid Scancode`,
            },
        });
    }

}
