import {ModuleAction, ModuleActionTypes, ModulesInCourse, ModuleState} from "../../types/module";
import {RequestError} from "../../types/error";

const initialState: ModuleState = {
    modules: {},
    loading: false,
    error: null
}

export const moduleReducer = (state = initialState, action: ModuleAction): ModuleState => {

    const setLoading = (): ModuleState => ({...state, loading: true, error: null})
    const setError = (error: RequestError): ModuleState => ({...state, loading: false, error: error})

    switch (action.type) {

        case ModuleActionTypes.GET_MODULES_FOR_COURSE:
            return setLoading()
        case ModuleActionTypes.GET_MODULES_FOR_COURSE_SUCCESS:
            const currentModules: ModulesInCourse = {...state.modules}
            currentModules[action.courseId] = action.payload

            return {...state, loading: false, error: null, modules: currentModules}
        case ModuleActionTypes.GET_MODULES_FOR_COURSE_ERROR:
            return setError(action.payload)

        case ModuleActionTypes.CREATE_MODULE:
            return setLoading()
        case ModuleActionTypes.CREATE_MODULE_SUCCESS:
            const newModules: ModulesInCourse = {...state.modules}
            newModules[action.courseId].push(action.payload)

            return {...state, loading: false, error: null, modules: newModules}
        case ModuleActionTypes.CREATE_MODULE_ERROR:
            return setError(action.payload)
        default:
            return state
    }
}