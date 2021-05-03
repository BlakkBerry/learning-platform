import {MaterialAction, MaterialActionTypes, MaterialState} from "../../types/common";
import {RequestError} from "../../types/error";

const initialState: MaterialState = {
    courses: [],
    loading: false,
    error: null
}

export const materialReducer = (state = initialState, action: MaterialAction): MaterialState => {
    const setLoading = (): MaterialState => ({...state, loading: true, error: null})
    const setError = (error: RequestError): MaterialState => ({...state, loading: false, error: error})

    switch (action.type) {
        case MaterialActionTypes.FETCH_MATERIALS:
            return setLoading()
        case MaterialActionTypes.FETCH_MATERIALS_SUCCESS:
            return {...state, loading: false, error: null, courses: action.payload}
        case MaterialActionTypes.FETCH_MATERIALS_ERROR:
            return setError(action.payload)
        default:
            return state
    }
}