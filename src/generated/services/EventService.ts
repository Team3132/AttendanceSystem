/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attendance } from '../models/Attendance';
import type { CreateEventDto } from '../models/CreateEventDto';
import type { Event } from '../models/Event';
import type { Rsvp } from '../models/Rsvp';
import type { UpdateEventDto } from '../models/UpdateEventDto';
import type { UpdateOrCreateAttendance } from '../models/UpdateOrCreateAttendance';
import type { UpdateOrCreateRSVP } from '../models/UpdateOrCreateRSVP';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EventService {

    /**
     * @returns Event 
     * @throws ApiError
     */
    public static eventControllerFindAll(): CancelablePromise<Array<Event>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event',
        });
    }

    /**
     * Create a new event
     * @param requestBody 
     * @returns Event 
     * @returns any 
     * @throws ApiError
     */
    public static eventControllerCreate(
requestBody: CreateEventDto,
): CancelablePromise<Event | any> {
        return __request(OpenAPI, {
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
    public static eventControllerFindOne(
id: string,
): CancelablePromise<Event> {
        return __request(OpenAPI, {
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
    public static eventControllerUpdate(
id: string,
requestBody: UpdateEventDto,
): CancelablePromise<Event> {
        return __request(OpenAPI, {
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
    public static eventControllerRemove(
id: string,
): CancelablePromise<Event> {
        return __request(OpenAPI, {
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
    public static eventControllerGetEventRsvp(
eventId: string,
): CancelablePromise<Rsvp> {
        return __request(OpenAPI, {
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
    public static eventControllerSetEventRsvp(
eventId: string,
requestBody: UpdateOrCreateRSVP,
): CancelablePromise<Rsvp> {
        return __request(OpenAPI, {
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
     * @param eventId 
     * @returns Rsvp 
     * @throws ApiError
     */
    public static eventControllerGetEventRsvps(
eventId: string,
): CancelablePromise<Array<Rsvp>> {
        return __request(OpenAPI, {
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
    public static eventControllerGetEventAttendance(
eventId: string,
): CancelablePromise<Attendance> {
        return __request(OpenAPI, {
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
    public static eventControllerSetEventAttendance(
eventId: string,
requestBody: UpdateOrCreateAttendance,
): CancelablePromise<Attendance> {
        return __request(OpenAPI, {
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
    public static eventControllerGetEventAttendances(
eventId: string,
): CancelablePromise<Array<Attendance>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{eventId}/attendances',
            path: {
                'eventId': eventId,
            },
        });
    }

}
