/**    
    @ApiBadRequestResponse()
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiMethodNotAllowedResponse()
    @ApiNotAcceptableResponse()
    @ApiRequestTimeoutResponse()
    @ApiConflictResponse()
    @ApiPreconditionFailedResponse()
    @ApiTooManyRequestsResponse()
    @ApiGoneResponse()
    @ApiPayloadTooLargeResponse()
    @ApiUnsupportedMediaTypeResponse()
    @ApiUnprocessableEntityResponse()
    @ApiInternalServerErrorResponse()
    @ApiNotImplementedResponse()
    @ApiBadGatewayResponse()
    @ApiServiceUnavailableResponse()
    @ApiGatewayTimeoutResponse()
    @ApiDefaultResponse()
 */

import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseTypeBadRequest {
  @ApiProperty()
  statusCode: 400;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeUnauthorized {
  @ApiProperty()
  statusCode: 401;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeForbidden {
  @ApiProperty()
  statusCode: 403;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeNotFound {
  @ApiProperty()
  statusCode: 404;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeMethodNotAllowed {
  @ApiProperty()
  statusCode: 405;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeNotAcceptable {
  @ApiProperty()
  statusCode: 406;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeRequestTimeout {
  @ApiProperty()
  statusCode: 408;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeConflict {
  @ApiProperty()
  statusCode: 409;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeGone {
  @ApiProperty()
  statusCode: 410;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypePayloadTooLarge {
  @ApiProperty()
  statusCode: 413;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeUnsupportedMediaType {
  @ApiProperty()
  statusCode: 415;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeUnprocessableEntity {
  @ApiProperty()
  statusCode: 422;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeInternalServerError {
  @ApiProperty()
  statusCode: 500;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeNotImplemented {
  @ApiProperty()
  statusCode: 501;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeBadGateway {
  @ApiProperty()
  statusCode: 502;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeServiceUnavailable {
  @ApiProperty()
  statusCode: 503;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeGatewayTimeout {
  @ApiProperty()
  statusCode: 504;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}

export class ApiResponseTypeDefault {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}
