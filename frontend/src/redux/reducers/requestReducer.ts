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

    if ("loadable" in action) {
        return setLoading()
    }

    if ("throwable" in action) {
        return setError(action.payload)
    }

    switch (action.type) {
        case RequestActionTypes.FETCH_COURSE_REQUESTS_SUCCESS:
            return setSuccess(action.payload)

        case RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS:
            return state

        default:
            return state
    }
}
