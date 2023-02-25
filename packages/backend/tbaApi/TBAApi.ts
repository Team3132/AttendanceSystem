/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { DistrictService } from './services/DistrictService';
import { EventService } from './services/EventService';
import { ListService } from './services/ListService';
import { MatchService } from './services/MatchService';
import { TbaService } from './services/TbaService';
import { TeamService } from './services/TeamService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class TBAApi {

    public readonly district: DistrictService;
    public readonly event: EventService;
    public readonly list: ListService;
    public readonly match: MatchService;
    public readonly tba: TbaService;
    public readonly team: TeamService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://www.thebluealliance.com/api/v3',
            VERSION: config?.VERSION ?? '3.8.2',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.district = new DistrictService(this.request);
        this.event = new EventService(this.request);
        this.list = new ListService(this.request);
        this.match = new MatchService(this.request);
        this.tba = new TbaService(this.request);
        this.team = new TeamService(this.request);
    }
}

