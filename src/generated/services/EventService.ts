/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attendance } from '../models/Attendance';
import type { CreateEventDto } from '../models/CreateEventDto';
import type { Event } from '../models/Event';
import type { Rsvp } from '../models/Rsvp';
import type { ScaninDto } from '../models/ScaninDto';
import type { UpdateEventDto } from '../models/UpdateEventDto';
import type { UpdateOrCreateAttendance } from '../models/UpdateOrCreateAttendance';
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
     * Create a new event
     * @param requestBody
     * @returns Event
     * @returns any
     * @throws ApiError
     */
    public eventControllerCreate(
        requestBody: CreateEventDto,
    ): CancelablePromise<Event | any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a specific event
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
     * Update an event.
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
     * Delete an event
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
     * Get a user's rsvp status for an event.
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
     * Set a logged in user's RSVP status for an event.
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
     * Update RSVP Status of Events in range
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
     * Get a user's attendance status for an event
     * @param eventId
     * @returns Attendance
     * @throws ApiError
     */
    public eventControllerGetEventAttendance(
        eventId: string,
    ): CancelablePromise<Attendance> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{eventId}/attendance',
            path: {
                'eventId': eventId,
            },
        });
    }

    /**
     * Set a user's attendance status for an event.
     * @param eventId
     * @param requestBody
     * @returns Attendance
     * @throws ApiError
     */
    public eventControllerSetEventAttendance(
        eventId: string,
        requestBody: UpdateOrCreateAttendance,
    ): CancelablePromise<Attendance> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event/{eventId}/attendance',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param eventId
     * @returns Attendance
     * @throws ApiError
     */
    public eventControllerGetEventAttendances(
        eventId: string,
    ): CancelablePromise<Array<Attendance>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{eventId}/attendances',
            path: {
                'eventId': eventId,
            },
        });
    }

    /**
     * @param eventId
     * @param requestBody
     * @returns Attendance
     * @throws ApiError
     */
    public eventControllerScaninEvent(
        eventId: string,
        requestBody: ScaninDto,
    ): CancelablePromise<Attendance> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/event/{eventId}/scanin',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
