import {RequestError} from "./error";
import {User} from "./user";

export interface Request {
    id: number
    student: User
    code?: string
}

interface FetchCourseRequestsAction {
    type: RequestActionTypes.FETCH_COURSE_REQUESTS
}
interface FetchCourseRequestsSuccessAction {
    type: RequestActionTypes.FETCH_COURSE_REQUESTS_SUCCESS,
    payload: Array<Request>,
}
interface FetchCourseRequestsErrorAction {
    type: RequestActionTypes.FETCH_COURSE_REQUESTS_ERROR,
    payload: RequestError
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

export interface RequestState {
    requests: Array<Request>
    loading: boolean
    error: RequestError | null
}

export enum RequestActionTypes {

    FETCH_COURSE_REQUESTS = 'REQUESTS/FETCH_COURSE_REQUESTS',
    FETCH_COURSE_REQUESTS_SUCCESS = 'REQUESTS/FETCH_COURSE_REQUESTS_SUCCESS',
    FETCH_COURSE_REQUESTS_ERROR = 'REQUESTS/FETCH_COURSE_REQUESTS_ERROR',

    CREATE_COURSE_REQUEST = 'REQUESTS/CREATE_COURSE_REQUEST',
    CREATE_COURSE_REQUEST_SUCCESS = 'REQUESTS/CREATE_COURSE_REQUEST_SUCCESS',
    CREATE_COURSE_REQUEST_ERROR = 'REQUESTS/CREATE_COURSE_REQUEST_ERROR'
}

export type RequestAction =
    CreateCourseRequestAction |
    CreateCourseRequestSuccessAction |
    CreateCourseRequestErrorAction |
    FetchCourseRequestsAction |
    FetchCourseRequestsSuccessAction |
    FetchCourseRequestsErrorAction
