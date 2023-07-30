/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from "./core/BaseHttpRequest";
import type { OpenAPIConfig } from "./core/OpenAPI";
import { FetchHttpRequest } from "./core/FetchHttpRequest";

import { AppService } from "./services/AppService";
import { AuthService } from "./services/AuthService";
import { BotService } from "./services/BotService";
import { DefaultService } from "./services/DefaultService";
import { EventService } from "./services/EventService";
import { OutreachService } from "./services/OutreachService";
import { RsvpService } from "./services/RsvpService";
import { ScancodeService } from "./services/ScancodeService";
import { UserService } from "./services/UserService";

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ApiClient {
  public readonly app: AppService;
  public readonly auth: AuthService;
  public readonly bot: BotService;
  public readonly default: DefaultService;
  public readonly event: EventService;
  public readonly outreach: OutreachService;
  public readonly rsvp: RsvpService;
  public readonly scancode: ScancodeService;
  public readonly user: UserService;

  public readonly request: BaseHttpRequest;

  constructor(
    config?: Partial<OpenAPIConfig>,
    HttpRequest: HttpRequestConstructor = FetchHttpRequest
  ) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? "",
      VERSION: config?.VERSION ?? "1.0",
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? "include",
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.app = new AppService(this.request);
    this.auth = new AuthService(this.request);
    this.bot = new BotService(this.request);
    this.default = new DefaultService(this.request);
    this.event = new EventService(this.request);
    this.outreach = new OutreachService(this.request);
    this.rsvp = new RsvpService(this.request);
    this.scancode = new ScancodeService(this.request);
    this.user = new UserService(this.request);
  }
}
