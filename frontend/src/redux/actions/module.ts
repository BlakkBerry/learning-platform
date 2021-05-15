import {Dispatch} from "redux";
import {Module, ModuleAction, ModuleActionTypes} from "../../types/module";
import {authAxios} from "../../utils/axios";

export const fetchModules = (courseId: number) => {
    return async (dispatch: Dispatch<ModuleAction>) => {
        try {
            dispatch({type: ModuleActionTypes.FETCH_MODULES})
            const response = await authAxios.get<Array<Module>>(`/courses/${courseId}/modules/`)
            dispatch({type: ModuleActionTypes.FETCH_MODULES_SUCCESS, payload: response.data, courseId})
        } catch (error) {
            dispatch({
                type: ModuleActionTypes.FETCH_MODULES_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch modules'}
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
                payload: {code: error.response.status, message: 'Failed to create the module'}
            })
        }
    }
}

export const updateModule = (courseId: number, moduleId: number, module: Partial<Module>) => {
    return async (dispatch: Dispatch<ModuleAction>) => {
        try {
            dispatch({type: ModuleActionTypes.UPDATE_MODULE})
            const response = await authAxios.put<Module>(`/courses/${courseId}/modules/${moduleId}/`, module)
            dispatch({type: ModuleActionTypes.UPDATE_MODULE_SUCCESS, payload: response.data, courseId, moduleId})
        } catch (error) {
            dispatch({
                type: ModuleActionTypes.UPDATE_MODULE_ERROR,
                payload: {code: error.response.status, message: 'Failed to update the module'}
            })
        }
    }
}

export const deleteModule = (courseId: number, moduleId: number) => {
    return async (dispatch: Dispatch<ModuleAction>) => {
        try {
            dispatch({type: ModuleActionTypes.DELETE_MODULE})
            await authAxios.delete(`/courses/${courseId}/modules/${moduleId}/`)
            dispatch({type: ModuleActionTypes.DELETE_MODULE_SUCCESS, courseId, moduleId})
        } catch (error) {
            dispatch({
                type: ModuleActionTypes.UPDATE_MODULE_ERROR,
                payload: {code: error.response.status, message: 'Failed to delete the module'}
            })
        }
    }
}
