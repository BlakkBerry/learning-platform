import {Dispatch} from "redux";
import {Request, RequestAction, RequestActionTypes} from "../../types/request";
import axios from "axios";

export const createCourseRequest = (code: string) => {
    return async (dispatch: Dispatch<RequestAction>) => {
        try {
            dispatch({type: RequestActionTypes.CREATE_COURSE_REQUEST})
            const response = await axios.post<Request>('http://127.0.0.1:8000/api/courses/request/', {code})
            dispatch({type: RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({type: RequestActionTypes.CREATE_COURSE_REQUEST_ERROR, payload: {code: error.response.status, message: 'Failed to send course request'}})
        }
    }
}