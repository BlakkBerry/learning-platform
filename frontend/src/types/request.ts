import {RequestError} from "./error";
import {User} from "./user";
import {Loadable, Throwable} from "./common";

export interface Request {
    id: number
    student: User
    code?: string
}

interface FetchCourseRequestsAction extends Loadable {
    type: RequestActionTypes.FETCH_COURSE_REQUESTS
}
interface FetchCourseRequestsSuccessAction {
    type: RequestActionTypes.FETCH_COURSE_REQUESTS_SUCCESS,
    payload: Array<Request>,
}
interface FetchCourseRequestsErrorAction extends Throwable {
    type: RequestActionTypes.FETCH_COURSE_REQUESTS_ERROR,
    payload: RequestError
}

interface CreateCourseRequestAction extends Loadable {
    type: RequestActionTypes.CREATE_COURSE_REQUEST
}
interface CreateCourseRequestSuccessAction {
    type: RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS,
    payload: Request
}
interface CreateCourseRequestErrorAction extends Throwable {
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
    FETCH_COURSE_REQUESTS_SUCCESS = 'REQUESTS/FETCH_COURSE_REQUESTS',
    FETCH_COURSE_REQUESTS_ERROR = 'REQUESTS/FETCH_COURSE_REQUESTS',

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
