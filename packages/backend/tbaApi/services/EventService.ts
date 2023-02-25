/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Award } from '../models/Award';
import type { Elimination_Alliance } from '../models/Elimination_Alliance';
import type { Event } from '../models/Event';
import type { Event_District_Points } from '../models/Event_District_Points';
import type { Event_Insights } from '../models/Event_Insights';
import type { Event_OPRs } from '../models/Event_OPRs';
import type { Event_Predictions } from '../models/Event_Predictions';
import type { Event_Ranking } from '../models/Event_Ranking';
import type { Event_Simple } from '../models/Event_Simple';
import type { Match } from '../models/Match';
import type { Match_Simple } from '../models/Match_Simple';
import type { Team } from '../models/Team';
import type { Team_Event_Status } from '../models/Team_Event_Status';
import type { Team_Simple } from '../models/Team_Simple';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EventService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Gets a list of all events this team has competed at.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event Successful response
     * @throws ApiError
     */
    public getTeamEvents(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events',
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
     * Gets a short-form list of all events this team has competed at.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Simple Successful response
     * @throws ApiError
     */
    public getTeamEventsSimple(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events/simple',
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
     * Gets a list of the event keys for all events this team has competed at.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getTeamEventsKeys(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events/keys',
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
     * Gets a list of events this team has competed at in the given year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event Successful response
     * @throws ApiError
     */
    public getTeamEventsByYear(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events/{year}',
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
     * Gets a short-form list of events this team has competed at in the given year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Simple Successful response
     * @throws ApiError
     */
    public getTeamEventsByYearSimple(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Event_Simple>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events/{year}/simple',
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
     * Gets a list of the event keys for events this team has competed at in the given year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns string Successful response
     * @throws ApiError
     */
    public getTeamEventsByYearKeys(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/events/{year}/keys',
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
     * Gets a list of awards the given team won at the given event.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Award Successful response
     * @throws ApiError
     */
    public getTeamEventAwards(
        teamKey: string,
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Award>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/event/{event_key}/awards',
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
     * Gets the competition rank and status of the team at the given event.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Event_Status Successful response
     * @throws ApiError
     */
    public getTeamEventStatus(
        teamKey: string,
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Team_Event_Status> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/event/{event_key}/status',
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
     * Gets an Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event Successful response
     * @throws ApiError
     */
    public getEvent(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}',
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
     * Gets a short-form Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Simple Successful response
     * @throws ApiError
     */
    public getEventSimple(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event_Simple> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/simple',
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
     * Gets a list of Elimination Alliances for the given Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Elimination_Alliance Successful response
     * @throws ApiError
     */
    public getEventAlliances(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Elimination_Alliance>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/alliances',
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
     * Gets a set of Event-specific insights for the given Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Insights Successful response
     * @throws ApiError
     */
    public getEventInsights(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event_Insights> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/insights',
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
     * Gets a set of Event OPRs (including OPR, DPR, and CCWM) for the given Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_OPRs Successful response
     * @throws ApiError
     */
    public getEventOpRs(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event_OPRs> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/oprs',
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
     * Gets information on TBA-generated predictions for the given Event. Contains year-specific information. *WARNING* This endpoint is currently under development and may change at any time.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Predictions Successful response
     * @throws ApiError
     */
    public getEventPredictions(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event_Predictions> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/predictions',
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
     * Gets a list of team rankings for the Event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Event_Ranking Successful response
     * @throws ApiError
     */
    public getEventRankings(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Event_Ranking> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/rankings',
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
     * Gets a list of awards from the given event.
     * @param eventKey TBA Event Key, eg `2016nytr`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Award Successful response
     * @throws ApiError
     */
    public getEventAwards(
        eventKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Award>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/event/{event_key}/awards',
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

}
