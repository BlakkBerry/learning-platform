import {RequestError} from "../../types/error";
import {Course, CourseAction, CourseActionTypes, CourseState} from "../../types/course";

const initialState: CourseState = {
    studentCourses: [],
    authorCourses: [],
    loading: false,
    error: null
}

export const courseReducer = (state = initialState, action: CourseAction): CourseState => {
    const setLoading = (): CourseState => ({...state, loading: true, error: null})
    const setStudentCourses = (courses: Course[]): CourseState => ({
        ...state,
        loading: false,
        error: null,
        studentCourses: courses
    })
    const setAuthorCourses = (courses: Course[]): CourseState => ({
        ...state,
        loading: false,
        error: null,
        authorCourses: courses
    })
    const setError = (error: RequestError): CourseState => ({...state, loading: false, error: error})

    switch (action.type) {

        case CourseActionTypes.FETCH_AUTHOR_COURSES:
        case CourseActionTypes.FETCH_STUDENT_COURSES:
        case CourseActionTypes.CREATE_SINGLE_COURSE:
        case CourseActionTypes.UPDATE_SINGLE_COURSE:
        case CourseActionTypes.DELETE_SINGLE_COURSE:
            return setLoading()

        case CourseActionTypes.FETCH_AUTHOR_COURSES_ERROR:
        case CourseActionTypes.FETCH_STUDENT_COURSES_ERROR:
        case CourseActionTypes.CREATE_SINGLE_COURSE_ERROR:
        case CourseActionTypes.UPDATE_SINGLE_COURSE_ERROR:
        case CourseActionTypes.DELETE_SINGLE_COURSE_ERROR:
            return setError(action.payload)

        case CourseActionTypes.FETCH_STUDENT_COURSES_SUCCESS:
            return setStudentCourses(action.payload)

        case CourseActionTypes.FETCH_AUTHOR_COURSES_SUCCESS:
            return setAuthorCourses(action.payload)

        case CourseActionTypes.CREATE_SINGLE_COURSE_SUCCESS:
            return setAuthorCourses([...state.authorCourses, action.payload])

        case CourseActionTypes.UPDATE_SINGLE_COURSE_SUCCESS:
            return setAuthorCourses([...state.authorCourses, action.payload])

        case CourseActionTypes.DELETE_SINGLE_COURSE_SUCCESS:
            const authorCourses = state.authorCourses.filter(course => course.id !== action.payload)

            return setAuthorCourses(authorCourses)

        default:
            return state
    }
}
