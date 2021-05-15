import {Dispatch} from "redux";
import {authAxios} from "../../utils/axios";
import {HomeTask, HomeTaskAction, HomeTaskActionTypes} from "../../types/hometask";

export const fetchHomeTasks = (courseId: number, moduleId: number, lessonId: number, taskId: number) => {
    return async (dispatch: Dispatch<HomeTaskAction>) => {
        try {
            dispatch({type: HomeTaskActionTypes.FETCH_HOMETASKS})
            const response = await authAxios.get<Array<HomeTask>>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/home_tasks/`)
            dispatch({type: HomeTaskActionTypes.FETCH_HOMETASKS_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: HomeTaskActionTypes.FETCH_HOMETASKS_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch home tasks'}
            })
        }
    }
}

export const createHomeTask = (courseId: number, moduleId: number, lessonId: number, taskId: number, homeTask: HomeTask) => {
    return async (dispatch: Dispatch<HomeTaskAction>) => {
        try {
            dispatch({type: HomeTaskActionTypes.CREATE_HOMETASK})
            const response = await authAxios.post<HomeTask>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/home_tasks/`, homeTask)
            dispatch({type: HomeTaskActionTypes.CREATE_HOMETASK_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: HomeTaskActionTypes.CREATE_HOMETASK_ERROR,
                payload: {code: error.response.status, message: 'Failed to create home task'}
            })
        }
    }
}

export const updateHomeTask = (courseId: number, moduleId: number, lessonId: number, taskId: number, homeTaskId: number, homeTask: Partial<HomeTask>) => {
    return async (dispatch: Dispatch<HomeTaskAction>) => {
        try {
            dispatch({type: HomeTaskActionTypes.UPDATE_HOMETASK})
            const response = await authAxios.put<HomeTask>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/home_tasks/${homeTaskId}/`, homeTask)
            dispatch({type: HomeTaskActionTypes.UPDATE_HOMETASK_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: HomeTaskActionTypes.UPDATE_HOMETASK_ERROR,
                payload: {code: error.response.status, message: 'Failed to update home task'}
            })
        }
    }
}

export const deleteHomeTask = (courseId: number, moduleId: number, lessonId: number, taskId: number, homeTaskId: number) => {
    return async (dispatch: Dispatch<HomeTaskAction>) => {
        try {
            dispatch({type: HomeTaskActionTypes.DELETE_HOMETASK})
            await authAxios.put<HomeTask>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/home_tasks/${homeTaskId}/`)
            dispatch({type: HomeTaskActionTypes.DELETE_HOMETASK_SUCCESS, homeTaskId})
        } catch (error) {
            dispatch({
                type: HomeTaskActionTypes.DELETE_HOMETASK_ERROR,
                payload: {code: error.response.status, message: 'Failed to delete home task'}
            })
        }
    }
}
