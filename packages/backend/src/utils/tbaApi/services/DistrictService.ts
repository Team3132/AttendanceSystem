/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { District_List } from '../models/District_List';
import type { District_Ranking } from '../models/District_Ranking';
import type { Event } from '../models/Event';
import type { Event_District_Points } from '../models/Event_District_Points';
import type { Event_Simple } from '../models/Event_Simple';
import type { Team } from '../models/Team';
import type { Team_Simple } from '../models/Team_Simple';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DistrictService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Gets an array of districts representing each year the team was in a district. Will return an empty array if the team was never in a district.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns District_List Successful response
     * @throws ApiError
     */
    public getTeamDistricts(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<District_List>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/districts',
            path: {
                'team_key': teamKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of team rankings for the Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_District_Points Successful response
     * @throws ApiError
     */
    public getEventDistrictPoints(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event_District_Points> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/district_points',
            path: {
                'event_key': eventKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of districts and their corresponding district key, for the given year.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns District_List Successful response
     * @throws ApiError
     */
    public getDistrictsByYear(
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<District_List>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/districts/{year}',
            path: {
                'year': year,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of events in the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event Successful response
     * @throws ApiError
     */
    public getDistrictEvents(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/events',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a short-form list of events in the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Simple Successful response
     * @throws ApiError
     */
    public getDistrictEventsSimple(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/events/simple',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of event keys for events in the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getDistrictEventsKeys(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/events/keys',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of `Team` objects that competed in events in the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team Successful response
     * @throws ApiError
     */
    public getDistrictTeams(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/teams',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a short-form list of `Team` objects that competed in events in the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Simple Successful response
     * @throws ApiError
     */
    public getDistrictTeamsSimple(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/teams/simple',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of `Team` objects that competed in events in the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getDistrictTeamsKeys(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/teams/keys',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

    /**
     * Gets a list of team district rankings for the given district.
     * @param districtKey TBA District Key, eg `2016fim`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns District_Ranking Successful response
     * @throws ApiError
     */
    public getDistrictRankings(
        districtKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<District_Ranking>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/district/{district_key}/rankings',
            path: {
                'district_key': districtKey,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `Not Modified - Use Local Cached Value`,
            },
        });
    }

}
