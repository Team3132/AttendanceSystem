/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEventDto } from '../models/CreateEventDto';
import type { EventResponseType } from '../models/EventResponseType';
import type { EventSecret } from '../models/EventSecret';
import type { Rsvp } from '../models/Rsvp';
import type { RsvpUser } from '../models/RsvpUser';
import type { ScaninDto } from '../models/ScaninDto';
import type { TokenCheckinDto } from '../models/TokenCheckinDto';
import type { UpdateEventDto } from '../models/UpdateEventDto';
import type { UpdateOrCreateRSVP } from '../models/UpdateOrCreateRSVP';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EventService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get all events
     * @param from 
     * @param to 
     * @param take 
     * @returns EventResponseType 
     * @throws ApiError
     */
    public getEvents(
from?: string,
to?: string,
take?: number,
): CancelablePromise<Array<EventResponseType>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/event',
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
     * @returns EventResponseType 
     * @throws ApiError
     */
    public createEvent(
requestBody: CreateEventDto,
): CancelablePromise<EventResponseType> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/event',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a specific event
     * @param id 
     * @returns EventResponseType 
     * @throws ApiError
     */
    public getEvent(
id: string,
): CancelablePromise<EventResponseType> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/event/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update an event
     * @param id 
     * @param requestBody 
     * @returns EventResponseType 
     * @throws ApiError
     */
    public updateEvent(
id: string,
requestBody: UpdateEventDto,
): CancelablePromise<EventResponseType> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/event/{id}',
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
     * @returns EventResponseType 
     * @throws ApiError
     */
    public deleteEvent(
id: string,
): CancelablePromise<EventResponseType> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/event/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get a specific event secret
     * @param eventId 
     * @returns EventSecret 
     * @throws ApiError
     */
    public getEventSecret(
eventId: string,
): CancelablePromise<EventSecret> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/event/{eventId}/token',
            path: {
                'eventId': eventId,
            },
        });
    }

    /**
     * Callback for a successful token
     * @param code 
     * @param eventId 
     * @returns any 
     * @throws ApiError
     */
    public getEventSecretCallback(
code: string,
eventId: string,
): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/event/{eventId}/token/callback',
            path: {
                'eventId': eventId,
            },
            query: {
                'code': code,
            },
        });
    }

    /**
     * Callback for a valid code (client input)
     * @param eventId 
     * @param requestBody 
     * @returns Rsvp 
     * @throws ApiError
     */
    public scanintoEvent(
eventId: string,
requestBody: TokenCheckinDto,
): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/event/{eventId}/token/callback',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Checkout a user's RSVP
     * @param eventId 
     * @returns Rsvp 
     * @throws ApiError
     */
    public checkoutUser(
eventId: string,
): CancelablePromise<Rsvp> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/event/{eventId}/checkout',
            path: {
                'eventId': eventId,
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
            url: '/api/event/{eventId}/rsvp',
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
            url: '/api/event/{eventId}/rsvp',
            path: {
                'eventId': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get an event's asociated RSVPs
     * @param eventId 
     * @returns RsvpUser 
     * @throws ApiError
     */
    public getEventRsvps(
eventId: string,
): CancelablePromise<Array<RsvpUser>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/event/{eventId}/rsvps',
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
            url: '/api/event/{eventId}/scanin',
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
