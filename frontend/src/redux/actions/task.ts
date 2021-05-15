import {Dispatch} from "redux";
import {authAxios} from "../../utils/axios";
import {Task, TaskAction, TaskActionTypes} from "../../types/task";

export const fetchTasks = (courseId: number, moduleId: number, lessonId: number) => {
    return async (dispatch: Dispatch<TaskAction>) => {
        try {
            dispatch({type: TaskActionTypes.FETCH_TASKS})
            const response = await authAxios.get<Array<Task>>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/`)
            dispatch({type: TaskActionTypes.FETCH_TASKS_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: TaskActionTypes.FETCH_TASKS_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch tasks'}
            })
        }
    }
}

export const createTask = (courseId: number, moduleId: number, lessonId: number, task: Task) => {
    return async (dispatch: Dispatch<TaskAction>) => {
        try {
            dispatch({type: TaskActionTypes.CREATE_TASK})
            const response = await authAxios.post<Task>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/`, task)
            dispatch({type: TaskActionTypes.CREATE_TASK_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: TaskActionTypes.CREATE_TASK_ERROR,
                payload: {code: error.response.status, message: 'Failed to create the task'}
            })
        }
    }
}

export const updateTask = (courseId: number, moduleId: number, lessonId: number, taskId: number, task: Partial<Task>) => {
    return async (dispatch: Dispatch<TaskAction>) => {
        try {
            dispatch({type: TaskActionTypes.UPDATE_TASK})
            const response = await authAxios.put<Task>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/`, task)
            dispatch({type: TaskActionTypes.UPDATE_TASK_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: TaskActionTypes.UPDATE_TASK_ERROR,
                payload: {code: error.response.status, message: 'Failed to update the task'}
            })
        }
    }
}

export const deleteTask = (courseId: number, moduleId: number, lessonId: number, taskId: number) => {
    return async (dispatch: Dispatch<TaskAction>) => {
        try {
            dispatch({type: TaskActionTypes.DELETE_TASK})
            await authAxios.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/`)
            dispatch({type: TaskActionTypes.DELETE_TASK_SUCCESS, taskId})
        } catch (error) {
            dispatch({
                type: TaskActionTypes.DELETE_TASK_ERROR,
                payload: {code: error.response.status, message: 'Failed to delete the task'}
            })
        }
    }
}
