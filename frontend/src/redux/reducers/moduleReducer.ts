import {Module, ModuleAction, ModuleActionTypes, ModuleState} from "../../types/module";
import {RequestError} from "../../types/error";
import {CommonAction, CommonActionTypes} from "../../types/common";


const initialState: ModuleState = {
    modules: [],
    loading: false,
    error: null
}

export const moduleReducer = (state = initialState, action: ModuleAction | CommonAction): ModuleState => {
    const setLoading = (): ModuleState => ({...state, loading: true, error: null})
    const setModules = (modules: Module[]): ModuleState => ({...state, loading: false, error: null, modules})
    const setError = (error: RequestError): ModuleState => ({...state, loading: false, error: error})

    switch (action.type) {

        case ModuleActionTypes.FETCH_MODULES:
        case ModuleActionTypes.CREATE_MODULE:
        case ModuleActionTypes.UPDATE_MODULE:
        case ModuleActionTypes.DELETE_MODULE:
            return setLoading()

        case ModuleActionTypes.FETCH_MODULES_ERROR:
        case ModuleActionTypes.CREATE_MODULE_ERROR:
        case ModuleActionTypes.UPDATE_MODULE_ERROR:
        case ModuleActionTypes.DELETE_MODULE_ERROR:
            return setError(action.payload)


        case ModuleActionTypes.FETCH_MODULES_SUCCESS:
            return setModules(action.payload)

        case ModuleActionTypes.CREATE_MODULE_SUCCESS:
            return setModules([...state.modules, action.payload])

        case ModuleActionTypes.UPDATE_MODULE_SUCCESS:
            return setModules(
                state.modules.map(module => {
                    if (module.id === action.moduleId) {
                        return action.payload
                    }
                    return module
                }))

        case ModuleActionTypes.DELETE_MODULE_SUCCESS:
            return setModules(state.modules.filter(module => module.id !== action.moduleId))

        case CommonActionTypes.CLEAR_ERROR:
            return {...state, error: null}

        default:
            return state
    }
}
