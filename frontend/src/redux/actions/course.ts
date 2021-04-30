import {Dispatch} from "redux";
import {Course, CourseAction, CourseActionTypes} from "../../types/course";
import axios from "axios";

export const fetchCourses = () => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.FETCH_COURSES})
            const response = await axios.get('http://127.0.0.1:8000/api/courses/')
            dispatch({type: CourseActionTypes.FETCH_COURSES_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: CourseActionTypes.FETCH_COURSES_ERROR,
                payload: {code: error.response.status, message: 'Fetching courses error'}
            })
        }
    }
}

export const createCourse = (course: Course) => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.CREATE_SINGLE_COURSE})
            const response = await axios.post('http://127.0.0.1:8000/api/courses/', course)
            dispatch({type: CourseActionTypes.CREATE_SINGLE_COURSE_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: CourseActionTypes.CREATE_SINGLE_COURSE_ERROR,
                payload: {code: error.response.status, message: 'Failed to create course'}
            })
        }
    }
}

export const updateCourse = (courseId: number, course: Partial<Course>) => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.UPDATE_SINGLE_COURSE})
            const response = await axios.put(`http://127.0.0.1:8000/api/courses/${courseId}/`, course)
            dispatch({type: CourseActionTypes.UPDATE_SINGLE_COURSE_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({type: CourseActionTypes.UPDATE_SINGLE_COURSE_ERROR, payload: {code: error.response.status, message: `Failed to update course with ID ${courseId}`}})
        }
    }
}

export const deleteCourse = (courseId: number) => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.DELETE_SINGLE_COURSE})
            await axios.delete(`http://127.0.0.1:8000/api/courses/${courseId}/`)
            dispatch({type: CourseActionTypes.DELETE_SINGLE_COURSE_SUCCESS, payload: courseId})
        } catch (error) {
            dispatch({
                type: CourseActionTypes.DELETE_SINGLE_COURSE_ERROR,
                payload: {code: error.response.status, message: `Failed to delete course with ID ${courseId}`}
            })
        }
    }
}