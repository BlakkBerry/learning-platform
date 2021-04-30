import {Request, RequestAction, RequestActionTypes, RequestState} from "../../types/request";

const initialState: RequestState = {
    requests: [],
    loading: false,
    error: null
}

export const requestReducer = (state: RequestState = initialState, action: RequestAction): RequestState => {
    const setLoading = (): RequestState => ({...state, loading: true, error: null})
    const setSuccess = (requests: Array<Request>): RequestState => ({...state, loading: false, error: null, requests})
    const setError = (error: string): RequestState => ({...state, loading: false, error: error}) // TODO change error type

    switch (action.type) {
        case RequestActionTypes.CREATE_COURSE_REQUEST:
            return setLoading()
        case RequestActionTypes.CREATE_COURSE_REQUEST_SUCCESS:
            return setSuccess([...state.requests, action.payload])
        case RequestActionTypes.CREATE_COURSE_REQUEST_ERROR:
            return setError(action.payload)
        default:
            return state
    }
}