/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { District_Ranking } from '../models/District_Ranking';
import type { Event } from '../models/Event';
import type { Event_Simple } from '../models/Event_Simple';
import type { Team } from '../models/Team';
import type { Team_Event_Status } from '../models/Team_Event_Status';
import type { Team_Simple } from '../models/Team_Simple';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ListService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Gets a list of `Team` objects, paginated in groups of 500.
     * @param pageNum Page number of results to return, zero-indexed
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team Successful response
     * @throws ApiError
     */
    public getTeams(
        pageNum: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{page_num}',
            path: {
                'page_num': pageNum,
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
     * Gets a list of short form `Team_Simple` objects, paginated in groups of 500.
     * @param pageNum Page number of results to return, zero-indexed
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Simple Successful response
     * @throws ApiError
     */
    public getTeamsSimple(
        pageNum: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{page_num}/simple',
            path: {
                'page_num': pageNum,
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
     * Gets a list of Team keys, paginated in groups of 500. (Note, each page will not have 500 teams, but will include the teams within that range of 500.)
     * @param pageNum Page number of results to return, zero-indexed
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getTeamsKeys(
        pageNum: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{page_num}/keys',
            path: {
                'page_num': pageNum,
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
     * Gets a list of `Team` objects that competed in the given year, paginated in groups of 500.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param pageNum Page number of results to return, zero-indexed
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team Successful response
     * @throws ApiError
     */
    public getTeamsByYear(
        year: number,
        pageNum: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{year}/{page_num}',
            path: {
                'year': year,
                'page_num': pageNum,
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
     * Gets a list of short form `Team_Simple` objects that competed in the given year, paginated in groups of 500.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param pageNum Page number of results to return, zero-indexed
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Simple Successful response
     * @throws ApiError
     */
    public getTeamsByYearSimple(
        year: number,
        pageNum: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{year}/{page_num}/simple',
            path: {
                'year': year,
                'page_num': pageNum,
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
     * Gets a list Team Keys that competed in the given year, paginated in groups of 500.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param pageNum Page number of results to return, zero-indexed
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getTeamsByYearKeys(
        year: number,
        pageNum: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{year}/{page_num}/keys',
            path: {
                'year': year,
                'page_num': pageNum,
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
     * Gets a key-value list of the event statuses for events this team has competed at in the given year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Event_Status Successful response
     * @throws ApiError
     */
    public getTeamEventsStatusesByYear(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Record<string, Team_Event_Status>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events/{year}/statuses',
            path: {
                'team_key': teamKey,
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
     * Gets a list of events in the given year.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event Successful response
     * @throws ApiError
     */
    public getEventsByYear(
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/events/{year}',
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
     * Gets a short-form list of events in the given year.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Simple Successful response
     * @throws ApiError
     */
    public getEventsByYearSimple(
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/events/{year}/simple',
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
     * Gets a list of event keys in the given year.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getEventsByYearKeys(
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/events/{year}/keys',
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
     * Gets a list of `Team` objects that competed in the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team Successful response
     * @throws ApiError
     */
    public getEventTeams(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/teams',
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
     * Gets a short-form list of `Team` objects that competed in the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Simple Successful response
     * @throws ApiError
     */
    public getEventTeamsSimple(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/teams/simple',
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
     * Gets a list of `Team` keys that competed in the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getEventTeamsKeys(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/teams/keys',
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
     * Gets a key-value list of the event statuses for teams competing at the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Event_Status Successful response
     * @throws ApiError
     */
    public getEventTeamsStatuses(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Record<string, Team_Event_Status>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/teams/statuses',
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
