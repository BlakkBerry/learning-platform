import {Dispatch} from "redux";
import {authAxios} from "../../utils/axios";
import {Lesson, LessonAction, LessonActionTypes} from "../../types/lesson";

export const fetchLessons = (courseId: number, moduleId: number) => {
    return async (dispatch: Dispatch<LessonAction>) => {
        try {
            dispatch({type: LessonActionTypes.FETCH_LESSONS, loadable: true})
            const response = await authAxios.get<Array<Lesson>>(`/courses/${courseId}/modules/${moduleId}/lessons/`)
            dispatch({type: LessonActionTypes.FETCH_LESSONS_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: LessonActionTypes.FETCH_LESSONS_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch lessons'},
                throwable: true
            })
        }
    }
}

export const createLesson = (courseId: number, moduleId: number, lesson: Lesson) => {
    return async (dispatch: Dispatch<LessonAction>) => {
        try {
            dispatch({type: LessonActionTypes.CREATE_LESSON, loadable: true})
            const response = await authAxios.post<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/`, lesson)
            dispatch({type: LessonActionTypes.CREATE_LESSON_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: LessonActionTypes.CREATE_LESSON_ERROR,
                payload: {code: error.response.status, message: 'Failed to create the lesson'},
                throwable: true
            })
        }
    }
}

export const updateLesson = (courseId: number, moduleId: number, lessonId: number, lesson: Partial<Lesson>) => {
    return async (dispatch: Dispatch<LessonAction>) => {
        try {
            dispatch({type: LessonActionTypes.UPDATE_LESSON, loadable: true})
            const response = await authAxios.put<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`, lesson)
            dispatch({type: LessonActionTypes.UPDATE_LESSON_SUCCESS, payload: response.data, lessonId})
        } catch (error) {
            dispatch({
                type: LessonActionTypes.UPDATE_LESSON_ERROR,
                payload: {code: error.response.status, message: 'Failed to update the lesson'},
                throwable: true
            })
        }
    }
}

export const deleteLesson = (courseId: number, moduleId: number, lessonId: number) => {
    return async (dispatch: Dispatch<LessonAction>) => {
        try {
            dispatch({type: LessonActionTypes.DELETE_LESSON, loadable: true})
            await authAxios.delete<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`)
            dispatch({type: LessonActionTypes.DELETE_LESSON_SUCCESS, courseId, moduleId, lessonId})
        } catch (error) {
            dispatch({
                type: LessonActionTypes.DELETE_LESSON_ERROR,
                payload: {code: error.response.status, message: 'Failed to delete the lesson'},
                throwable: true
            })
        }
    }
}
