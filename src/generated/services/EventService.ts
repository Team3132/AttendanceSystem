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
     * Get all events
     * @param from
     * @param to
     * @param take
     * @returns Event
     * @throws ApiError
     */
    public getEvents(
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
     * @throws ApiError
     */
    public createEvent(
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
     * Get a specific event
     * @param id
     * @returns Event
     * @throws ApiError
     */
    public getEvent(
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
     * Update an event
     * @param id
     * @param requestBody
     * @returns Event
     * @throws ApiError
     */
    public updateEvent(
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
    public deleteEvent(
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
     * Get a user's rsvp status for an event
     * @param eventId
     * @returns Rsvp
     * @throws ApiError
     */
    public getEventRsvp(
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
     * Set a logged in user's RSVP status for an event
     * @param eventId
     * @param requestBody
     * @returns Rsvp
     * @throws ApiError
     */
    public setEventRsvp(
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
    public updateEventRsvpRange(
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
     * Get an event's asociated RSVPs
     * @param eventId
     * @returns Rsvp
     * @throws ApiError
     */
    public getEventRsvps(
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
     * RSVP to an event by using a scancode
     * @param eventId
     * @param requestBody
     * @returns Rsvp
     * @throws ApiError
     */
    public scaninEvent(
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
