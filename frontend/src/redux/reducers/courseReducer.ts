import {Course, CourseAction, CourseActionTypes, CourseState} from "../../types/course";
import {RequestError} from "../../types/error";

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null
}

export const courseReducer = (state = initialState, action: CourseAction): CourseState => {
    const setLoading = (): CourseState => ({...state, loading: true, error: null})
    const setSuccess = (courses: Array<Course>): CourseState => ({...state, loading: false, error: null, courses: courses})
    const setError = (error: RequestError): CourseState => ({...state, loading: false, error: error}) // TODO change error type

    switch (action.type) {
        case CourseActionTypes.FETCH_COURSES:
            return setLoading()
        case CourseActionTypes.FETCH_COURSES_SUCCESS:
            return setSuccess(action.payload)
        case CourseActionTypes.FETCH_COURSES_ERROR:
            return setError(action.payload)

        case CourseActionTypes.CREATE_SINGLE_COURSE:
            return setLoading()
        case CourseActionTypes.CREATE_SINGLE_COURSE_SUCCESS:
            return setSuccess([...state.courses, action.payload])
        case CourseActionTypes.CREATE_SINGLE_COURSE_ERROR:
            return setError(action.payload)

        case CourseActionTypes.UPDATE_SINGLE_COURSE:
            return setLoading()
        case CourseActionTypes.UPDATE_SINGLE_COURSE_SUCCESS:
            const updatedCourses = state.courses.map(course => {
                return course.id === action.payload.id ? action.payload : course
            })
            return setSuccess(updatedCourses)
        case CourseActionTypes.UPDATE_SINGLE_COURSE_ERROR:
            return setError(action.payload)

        case CourseActionTypes.DELETE_SINGLE_COURSE:
            return setLoading()
        case CourseActionTypes.DELETE_SINGLE_COURSE_SUCCESS:
            const courses = state.courses.filter(course => course.id !== action.payload)
            return setSuccess(courses)
        case CourseActionTypes.DELETE_SINGLE_COURSE_ERROR:
            return setError(action.payload)


        default:
            return state
    }
}