/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attendance } from '../models/Attendance';
import type { CreateAttendanceDto } from '../models/CreateAttendanceDto';
import type { UpdateAttendanceDto } from '../models/UpdateAttendanceDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AttendanceService {

    /**
     * Create a new Attendance
     * @param requestBody 
     * @returns Attendance 
     * @returns any 
     * @throws ApiError
     */
    public static attendanceControllerCreate(
requestBody: CreateAttendanceDto,
): CancelablePromise<Attendance | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/attendance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Attendance 
     * @throws ApiError
     */
    public static attendanceControllerFindAll(): CancelablePromise<Array<Attendance>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attendance',
        });
    }

    /**
     * Get a specific attendance status
     * @param id 
     * @returns Attendance 
     * @throws ApiError
     */
    public static attendanceControllerFindOne(
id: string,
): CancelablePromise<Attendance> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attendance/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Update an Attendance status
     * @param id 
     * @param requestBody 
     * @returns Attendance 
     * @throws ApiError
     */
    public static attendanceControllerUpdate(
id: string,
requestBody: UpdateAttendanceDto,
): CancelablePromise<Attendance> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/attendance/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete an attendance
     * @param id 
     * @returns Attendance 
     * @throws ApiError
     */
    public static attendanceControllerRemove(
id: string,
): CancelablePromise<Attendance> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/attendance/{id}',
            path: {
                'id': id,
            },
        });
    }

}
