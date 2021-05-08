import {Module, ModuleAction, ModuleActionTypes, ModuleState} from "../../types/module";
import {RequestError} from "../../types/error";


const initialState: ModuleState = {
    modules: [],
    loading: false,
    error: null
}

export const moduleReducer = (state = initialState, action: ModuleAction): ModuleState => {
    const setLoading = (): ModuleState => ({...state, loading: true, error: null})
    const setModules = (modules: Module[]): ModuleState => ({...state, loading: false, error: null, modules})
    const setError = (error: RequestError): ModuleState => ({...state, loading: false, error: error})

    if ("loadable" in action) {
        return setLoading()
    }

    if ("throwable" in action) {
        return setError(action.payload)
    }

    switch (action.type) {
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
        default:
            return state
    }
}
