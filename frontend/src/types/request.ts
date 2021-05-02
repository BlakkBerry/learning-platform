import {RequestError} from "./error";
import {User} from "./user";

export interface Request {
    id: number
    student: User
    code?: string
}

interface CreateCourseRequestAction {
    type: RequestActionTypes.CREATE_COURSE_REQUEST
}
interface CreateCourseRequestSuccessAction {
    type: RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS,
    payload: Request
}
interface CreateCourseRequestErrorAction {
    type: RequestActionTypes.CREATE_COURSE_REQUEST_ERROR
    payload: RequestError
}

interface GetRequestsForCourse {
    type: RequestActionTypes.GET_REQUESTS_FOR_COURSE
}
interface GetRequestsForCourseSuccess {
    type: RequestActionTypes.GET_REQUESTS_FOR_COURSE_SUCCESS,
    courseId: number
    payload: Array<Request>,
}
interface GetRequestsForCourseError {
    type: RequestActionTypes.GET_REQUESTS_FOR_COURSE_ERROR,
    payload: RequestError
}

interface DeleteCourseRequest {
    type: RequestActionTypes.DELETE_COURSE_REQUEST
}
interface DeleteCourseRequestSuccess {
    type: RequestActionTypes.DELETE_COURSE_REQUEST_SUCCESS,
    courseId: number,
    requestId: number
}
interface DeleteCourseRequestError {
    type: RequestActionTypes.DELETE_COURSE_REQUEST_ERROR,
    payload: RequestError
}

export interface RequestState {
    requests: Array<Request>
    courseId: number | null
    loading: boolean
    error: RequestError | null
}

export enum RequestActionTypes {
    CREATE_COURSE_REQUEST = 'REQUESTS/CREATE_COURSE_REQUEST',
    CREATE_COURSE_REQUEST_SUCCESS = 'REQUESTS/CREATE_COURSE_REQUEST_SUCCESS',
    CREATE_COURSE_REQUEST_ERROR = 'REQUESTS/CREATE_COURSE_REQUEST_ERROR',

    GET_REQUESTS_FOR_COURSE = 'REQUESTS/GET_REQUESTS_FOR_COURSE',
    GET_REQUESTS_FOR_COURSE_SUCCESS = 'REQUESTS/GET_REQUESTS_FOR_COURSE_SUCCESS',
    GET_REQUESTS_FOR_COURSE_ERROR = 'REQUESTS/GET_REQUESTS_FOR_COURSE_ERROR',

    DELETE_COURSE_REQUEST = 'REQUESTS/DELETE_COURSE_REQUEST',
    DELETE_COURSE_REQUEST_SUCCESS = 'REQUESTS/DELETE_COURSE_REQUEST_SUCCESS',
    DELETE_COURSE_REQUEST_ERROR = 'REQUESTS/DELETE_COURSE_REQUEST_ERROR'
}

export type RequestAction =
    CreateCourseRequestAction |
    CreateCourseRequestSuccessAction |
    CreateCourseRequestErrorAction |
    GetRequestsForCourse |
    GetRequestsForCourseSuccess |
    GetRequestsForCourseError |
    DeleteCourseRequest |
    DeleteCourseRequestSuccess |
    DeleteCourseRequestError