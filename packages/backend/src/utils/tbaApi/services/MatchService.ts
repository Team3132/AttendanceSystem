/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Match } from '../models/Match';
import type { Match_Simple } from '../models/Match_Simple';
import type { Zebra } from '../models/Zebra';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class MatchService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Gets a list of matches for the given team and event.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match Successful response
     * @throws ApiError
     */
    public getTeamEventMatches(
        teamKey: string,
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Match>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/event/{event_key}/matches',
            path: {
                'team_key': teamKey,
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
     * Gets a short-form list of matches for the given team and event.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match Successful response
     * @throws ApiError
     */
    public getTeamEventMatchesSimple(
        teamKey: string,
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Match>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/event/{event_key}/matches/simple',
            path: {
                'team_key': teamKey,
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
     * Gets a list of match keys for matches for the given team and event.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getTeamEventMatchesKeys(
        teamKey: string,
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/event/{event_key}/matches/keys',
            path: {
                'team_key': teamKey,
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
     * Gets a list of matches for the given team and year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match Successful response
     * @throws ApiError
     */
    public getTeamMatchesByYear(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Match>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/matches/{year}',
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
     * Gets a short-form list of matches for the given team and year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match_Simple Successful response
     * @throws ApiError
     */
    public getTeamMatchesByYearSimple(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Match_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/matches/{year}/simple',
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
     * Gets a list of match keys for matches for the given team and year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getTeamMatchesByYearKeys(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/matches/{year}/keys',
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
     * Gets a list of matches for the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match Successful response
     * @throws ApiError
     */
    public getEventMatches(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Match>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/matches',
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
     * Gets a short-form list of matches for the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match_Simple Successful response
     * @throws ApiError
     */
    public getEventMatchesSimple(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Match_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/matches/simple',
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
     * Gets a list of match keys for the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getEventMatchesKeys(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/matches/keys',
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
     * Gets an array of Match Keys for the given event key that have timeseries data. Returns an empty array if no matches have timeseries data.
     * *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
     * *WARNING:* This endpoint and corresponding data models are under *active development* and may change at any time, including in breaking ways.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getEventMatchTimeseries(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/matches/timeseries',
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
     * Gets a `Match` object for the given match key.
     * @param matchKey TBA Match Key, eg `2016nytr_qm1`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match Successful response
     * @throws ApiError
     */
    public getMatch(
        matchKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Match> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/match/{match_key}',
            path: {
                'match_key': matchKey,
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
     * Gets a short-form `Match` object for the given match key.
     * @param matchKey TBA Match Key, eg `2016nytr_qm1`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Match_Simple Successful response
     * @throws ApiError
     */
    public getMatchSimple(
        matchKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Match_Simple> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/match/{match_key}/simple',
            path: {
                'match_key': matchKey,
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
     * Gets an array of game-specific Match Timeseries objects for the given match key or an empty array if not available.
     * *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
     * *WARNING:* This endpoint and corresponding data models are under *active development* and may change at any time, including in breaking ways.
     * @param matchKey TBA Match Key, eg `2016nytr_qm1`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns any Successful response
     * @throws ApiError
     */
    public getMatchTimeseries(
        matchKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<any>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/match/{match_key}/timeseries',
            path: {
                'match_key': matchKey,
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
     * Gets Zebra MotionWorks data for a Match for the given match key.
     * @param matchKey TBA Match Key, eg `2016nytr_qm1`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Zebra Successful response
     * @throws ApiError
     */
    public getMatchZebra(
        matchKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Zebra> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/match/{match_key}/zebra_motionworks',
            path: {
                'match_key': matchKey,
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
