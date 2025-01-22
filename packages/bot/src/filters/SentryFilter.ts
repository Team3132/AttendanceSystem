import { ArgumentsHost, Catch, HttpServer } from "@nestjs/common";
import { AbstractHttpAdapter, BaseExceptionFilter } from "@nestjs/core";
import * as Sentry from "@sentry/node";

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  handleUnknownError(
    exception: unknown,
    host: ArgumentsHost,
    // biome-ignore lint/suspicious/noExplicitAny: Let it do what it's gonna do
    applicationRef: HttpServer<any, any> | AbstractHttpAdapter<any, any, any>,
  ): void {
    Sentry.captureException(exception);
    super.handleUnknownError(exception, host, applicationRef);
  }
}
