import {Dispatch} from "redux";
import {Request, RequestAction, RequestActionTypes} from "../../types/request";
import {authAxios} from "../../utils/axios";
import {ModuleActionTypes} from "../../types/module";

export const fetchCourseRequests = (courseId: number) => {
    return async (dispatch: Dispatch<RequestAction>) => {
        try {
            dispatch({type: RequestActionTypes.FETCH_COURSE_REQUESTS})
            const response = await authAxios.get<Array<Request>>(`/courses/${courseId}/requests/`)
            dispatch({type: RequestActionTypes.FETCH_COURSE_REQUESTS_SUCCESS, courseId, payload: response.data})
        } catch (error) {
            dispatch({
                type: RequestActionTypes.FETCH_COURSE_REQUESTS_ERROR,
                payload: {code: error.response.status, message: `Failed to get requests for course with ID ${courseId}`}
            })
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
            dispatch({
                type: RequestActionTypes.CREATE_COURSE_REQUEST_ERROR,
                payload: {code: error.response.status, message: 'Failed to send course request'}
            })
        }
    }
}

export const acceptCourseRequest = (courseId: number, requestId: number) => {
    return async (dispatch: Dispatch<RequestAction>) => {
        try {
            dispatch({type: RequestActionTypes.ACCEPT_COURSE_REQUEST})
            await authAxios.put(`/courses/${courseId}/requests/${requestId}/`)
            dispatch({type: RequestActionTypes.ACCEPT_COURSE_REQUEST_SUCCESS, courseId, requestId})
        } catch (error) {
            dispatch({
                type: RequestActionTypes.ACCEPT_COURSE_REQUEST_ERROR,
                payload: {code: error.response.status, message: 'Failed to accept course request'}
            })
        }
    }
}

export const deleteCourseRequest = (courseId: number, requestId: number) => {
    return async (dispatch: Dispatch<RequestAction>) => {
        try {
            dispatch({type: RequestActionTypes.DELETE_COURSE_REQUEST})
            await authAxios.delete(`/courses/${courseId}/requests/${requestId}/`)
            dispatch({type: RequestActionTypes.DELETE_COURSE_REQUEST_SUCCESS, courseId, requestId})
        } catch (error) {
            dispatch({
                type: RequestActionTypes.DELETE_COURSE_REQUEST_ERROR,
                payload: {code: error.response.status, message: 'Failed to delete course request'}
            })
        }
    }
}
