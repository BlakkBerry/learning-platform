import {Request, RequestAction, RequestActionTypes, RequestState} from "../../types/request";
import {RequestError} from "../../types/error";

const initialState: RequestState = {
    requests: [],
    courseId: null,
    loading: false,
    error: null
}

export const requestReducer = (state: RequestState = initialState, action: RequestAction): RequestState => {
    const setLoading = (): RequestState => ({...state, loading: true, error: null})
    const setSuccess = (requests: Array<Request>): RequestState => ({...state, loading: false, error: null, requests})
    const setError = (error: RequestError): RequestState => ({...state, loading: false, error: error})

    switch (action.type) {
        case RequestActionTypes.CREATE_COURSE_REQUEST:
            return setLoading()
        case RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS:
            return state
        case RequestActionTypes.CREATE_COURSE_REQUEST_ERROR:
            return setError(action.payload)

        case RequestActionTypes.GET_REQUESTS_FOR_COURSE:
            return setLoading()
        case RequestActionTypes.GET_REQUESTS_FOR_COURSE_SUCCESS:
            return {...state, loading: false, error: null, courseId: action.courseId, requests: action.payload}
        case RequestActionTypes.GET_REQUESTS_FOR_COURSE_ERROR:
            return setError(action.payload)

        case RequestActionTypes.DELETE_COURSE_REQUEST:
            return setLoading()
        case RequestActionTypes.DELETE_COURSE_REQUEST_SUCCESS:
            if (state.courseId !== action.courseId) return state

            return setSuccess(state.requests.filter(request => request.id !== action.requestId))
        case RequestActionTypes.DELETE_COURSE_REQUEST_ERROR:
            return setError(action.payload)
        default:
            return state
    }
}
