import {Dispatch} from "redux";
import {Request, RequestAction, RequestActionTypes} from "../../types/request";
import {authAxios} from "../../utils/axios";

export const fetchCourseRequests = (courseId: number) => {
    return async (dispatch: Dispatch<RequestAction>) => {
        try {
            dispatch({type: RequestActionTypes.FETCH_COURSE_REQUESTS})
            const response = await authAxios.get<Array<Request>>(`/courses/${courseId}/requests/`)
            dispatch({type: RequestActionTypes.FETCH_COURSE_REQUESTS_SUCCESS, courseId, payload: response.data})
        } catch (error) {
            dispatch({type: RequestActionTypes.FETCH_COURSE_REQUESTS_ERROR, payload: {code: error.response.status, message: `Failed to get requests for course with ID ${courseId}`}})
        }
    }
}

export const createCourseRequest = (code: string) => {
    return async (dispatch: Dispatch<RequestAction>) => {
        try {
            dispatch({type: RequestActionTypes.CREATE_COURSE_REQUEST})
            const response = await authAxios.post<Request>('/courses/request/', {code})
            dispatch({type: RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({type: RequestActionTypes.CREATE_COURSE_REQUEST_ERROR, payload: {code: error.response.status, message: 'Failed to send course request'}})
        }
    }
}
