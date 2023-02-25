/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Award } from '../models/Award';
import type { District_List } from '../models/District_List';
import type { District_Ranking } from '../models/District_Ranking';
import type { Event } from '../models/Event';
import type { Event_Simple } from '../models/Event_Simple';
import type { Match } from '../models/Match';
import type { Match_Simple } from '../models/Match_Simple';
import type { Media } from '../models/Media';
import type { Team } from '../models/Team';
import type { Team_Event_Status } from '../models/Team_Event_Status';
import type { Team_Robot } from '../models/Team_Robot';
import type { Team_Simple } from '../models/Team_Simple';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TeamService {

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
     * Gets a `Team` object for the team referenced by the given key.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team Successful response
     * @throws ApiError
     */
    public getTeam(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Team> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}',
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
     * Gets a `Team_Simple` object for the team referenced by the given key.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Simple Successful response
     * @throws ApiError
     */
    public getTeamSimple(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Team_Simple> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/simple',
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
     * Gets a list of years in which the team participated in at least one competition.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns number Successful response
     * @throws ApiError
     */
    public getTeamYearsParticipated(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<number>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/years_participated',
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
     * Gets a list of year and robot name pairs for each year that a robot name was provided. Will return an empty array if the team has never named a robot.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Team_Robot Successful response
     * @throws ApiError
     */
    public getTeamRobots(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Team_Robot>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/robots',
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
     * Gets a list of awards the given team has won.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Award Successful response
     * @throws ApiError
     */
    public getTeamAwards(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Award>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/awards',
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
     * Gets a list of awards the given team has won in a given year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Award Successful response
     * @throws ApiError
     */
    public getTeamAwardsByYear(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Award>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/awards/{year}',
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
     * Gets a list of Media (videos / pictures) for the given team and year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Media Successful response
     * @throws ApiError
     */
    public getTeamMediaByYear(
        teamKey: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Media>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/media/{year}',
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
     * Gets a list of Media (videos / pictures) for the given team and tag.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param mediaTag Media Tag which describes the Media.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Media Successful response
     * @throws ApiError
     */
    public getTeamMediaByTag(
        teamKey: string,
        mediaTag: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Media>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/media/tag/{media_tag}',
            path: {
                'team_key': teamKey,
                'media_tag': mediaTag,
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
     * Gets a list of Media (videos / pictures) for the given team, tag and year.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param mediaTag Media Tag which describes the Media.
     * @param year Competition Year (or Season). Must be 4 digits.
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Media Successful response
     * @throws ApiError
     */
    public getTeamMediaByTagYear(
        teamKey: string,
        mediaTag: string,
        year: number,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Media>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/media/tag/{media_tag}/{year}',
            path: {
                'team_key': teamKey,
                'media_tag': mediaTag,
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
     * Gets a list of Media (social media) for the given team.
     * @param teamKey TBA Team Key, eg `frc254`
     * @param ifNoneMatch Value of the `ETag` header in the most recently cached response by the client.
     * @returns Media Successful response
     * @throws ApiError
     */
    public getTeamSocialMedia(
        teamKey: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Array<Media>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/team/{team_key}/social_media',
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
