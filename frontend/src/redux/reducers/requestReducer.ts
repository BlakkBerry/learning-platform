import {Request, RequestAction, RequestActionTypes, RequestState} from "../../types/request";
import {RequestError} from "../../types/error";

const initialState: RequestState = {
    requests: [],
    loading: false,
    error: null
}

export const requestReducer = (state: RequestState = initialState, action: RequestAction): RequestState => {
    const setLoading = (): RequestState => ({...state, loading: true, error: null})
    const setSuccess = (requests: Array<Request>): RequestState => ({...state, loading: false, error: null, requests})
    const setError = (error: RequestError): RequestState => ({...state, loading: false, error: error})

    switch (action.type) {

        case RequestActionTypes.FETCH_COURSE_REQUESTS:
        case RequestActionTypes.CREATE_COURSE_REQUEST:
        case RequestActionTypes.ACCEPT_COURSE_REQUEST:
        case RequestActionTypes.DELETE_COURSE_REQUEST:
            return setLoading()

        case RequestActionTypes.FETCH_COURSE_REQUESTS_ERROR:
        case RequestActionTypes.CREATE_COURSE_REQUEST_ERROR:
        case RequestActionTypes.ACCEPT_COURSE_REQUEST_ERROR:
        case RequestActionTypes.DELETE_COURSE_REQUEST_ERROR:
            return setError(action.payload)

        case RequestActionTypes.FETCH_COURSE_REQUESTS_SUCCESS:
            return setSuccess(action.payload)

        case RequestActionTypes.DELETE_COURSE_REQUEST_SUCCESS:
        case RequestActionTypes.ACCEPT_COURSE_REQUEST_SUCCESS:
            return setSuccess(
                state.requests.filter(request => request.id !== action.requestId)
            )

        case RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS:
            return state

        default:
            return state
    }
}
