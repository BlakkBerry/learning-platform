export interface Request {
    id: number
    student: any // TODO change type
    code: string
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
    payload: string // TODO set error type
}

export interface RequestState {
    requests: Array<Request>
    loading: boolean
    error: string | null // TODO Create error type
}

export enum RequestActionTypes {
    CREATE_COURSE_REQUEST = 'REQUESTS/CREATE_COURSE_REQUEST',
    CREATE_COURSE_REQUEST_SUCCESS = 'REQUESTS/CREATE_COURSE_REQUEST_SUCCESS',
    CREATE_COURSE_REQUEST_ERROR = 'REQUESTS/CREATE_COURSE_REQUEST_ERROR',
}

export type RequestAction =
    CreateCourseRequestAction |
    CreateCourseRequestSuccessAction |
    CreateCourseRequestErrorAction