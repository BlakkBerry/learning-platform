import {Dispatch} from "redux";
import {Module, ModuleAction, ModuleActionTypes} from "../../types/module";
import {authAxios} from "../../utils/axios";

export const fetchModules = (courseId: number) => {
    return async (dispatch: Dispatch<ModuleAction>) => {
        try {
            dispatch({type: ModuleActionTypes.GET_MODULES_FOR_COURSE})
            const response = await authAxios.get<Array<Module>>(`/courses/${courseId}/modules/`)
            dispatch({type: ModuleActionTypes.GET_MODULES_FOR_COURSE_SUCCESS, payload: response.data, courseId})
        } catch (error) {
            dispatch({
                type: ModuleActionTypes.GET_MODULES_FOR_COURSE_ERROR,
                payload: {code: error.response.status, message: 'Fetching modules error'}
            })
        }
    }
}

export const createModule = (courseId: number, module: Module) => {
    return async (dispatch: Dispatch<ModuleAction>) => {
        try {
            dispatch({type: ModuleActionTypes.CREATE_MODULE})
            const response = await authAxios.post<Module>(`/courses/${courseId}/modules/`, module)
            dispatch({type: ModuleActionTypes.CREATE_MODULE_SUCCESS, payload: response.data, courseId})
        } catch (error) {
            dispatch({
                type: ModuleActionTypes.CREATE_MODULE_ERROR,
                payload: {code: error.response.status, message: 'Failed to create module'}
            })
        }
    }
}