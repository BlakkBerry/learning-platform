export interface Course {
    id?: number
    name: string
    description?: string
    code?: string
    subject?: string
    section?: string
    audience?: string
    created?: Date
    author?: number
    students: Array<any> // TODO Change type
}

interface FetchCoursesAction {
    type: CourseActionTypes.FETCH_COURSES
}
interface FetchCoursesSuccessAction {
    type: CourseActionTypes.FETCH_COURSES_SUCCESS
    payload: Array<Course>
}
interface FetchCoursesErrorAction {
    type: CourseActionTypes.FETCH_COURSES_ERROR
    payload: string // TODO error type
}

interface CreateCourseAction {
    type: CourseActionTypes.CREATE_SINGLE_COURSE
}
interface CreateCourseSuccessAction {
    type: CourseActionTypes.CREATE_SINGLE_COURSE_SUCCESS,
    payload: Course
}
interface CreateCourseErrorAction {
    type: CourseActionTypes.CREATE_SINGLE_COURSE_ERROR
    payload: string // TODO error type
}

interface UpdateCourseAction {
    type: CourseActionTypes.UPDATE_SINGLE_COURSE
}
interface UpdateCourseSuccessAction {
    type: CourseActionTypes.UPDATE_SINGLE_COURSE_SUCCESS
    payload: Course
}
interface UpdateCourseErrorAction {
    type: CourseActionTypes.UPDATE_SINGLE_COURSE_ERROR
    payload: string
}

interface DeleteCourseAction {
    type: CourseActionTypes.DELETE_SINGLE_COURSE
}
interface DeleteCourseSuccessAction {
    type: CourseActionTypes.DELETE_SINGLE_COURSE_SUCCESS,
    payload: number
}
interface DeleteCourseErrorAction {
    type: CourseActionTypes.DELETE_SINGLE_COURSE_ERROR
    payload: string
}

export interface CourseState {
    courses: Array<Course>
    loading: boolean
    error: string | null // TODO Create error type
}

export enum CourseActionTypes {
    FETCH_COURSES = 'COURSES/FETCH_COURSES',
    FETCH_COURSES_SUCCESS = 'COURSES/FETCH_COURSES_SUCCESS',
    FETCH_COURSES_ERROR = 'COURSES/FETCH_COURSES_ERROR',

    CREATE_SINGLE_COURSE = 'COURSES/CRATE_SINGLE_COURSE',
    CREATE_SINGLE_COURSE_SUCCESS = 'COURSES/CRATE_SINGLE_COURSE_SUCCESS',
    CREATE_SINGLE_COURSE_ERROR = 'COURSES/CREATE_SINGLE_COURSE_ERROR',

    UPDATE_SINGLE_COURSE = 'COURSES/UPDATE_SINGLE_COURSE',
    UPDATE_SINGLE_COURSE_SUCCESS = 'COURSES/UPDATE_SINGLE_COURSE_SUCCESS',
    UPDATE_SINGLE_COURSE_ERROR = 'COURSES/UPDATE_SINGLE_COURSE_ERROR',

    DELETE_SINGLE_COURSE = 'COURSES/DELETE_SINGLE_COURSE',
    DELETE_SINGLE_COURSE_SUCCESS = 'COURSES/DELETE_SINGLE_COURSE_SUCCESS',
    DELETE_SINGLE_COURSE_ERROR = 'COURSES/DELETE_SINGLE_COURSE_ERROR',
}

export type CourseAction =
    FetchCoursesAction |
    FetchCoursesSuccessAction |
    FetchCoursesErrorAction |
    CreateCourseAction |
    CreateCourseSuccessAction |
    CreateCourseErrorAction |
    UpdateCourseAction |
    UpdateCourseSuccessAction |
    UpdateCourseErrorAction |
    DeleteCourseAction |
    DeleteCourseSuccessAction |
    DeleteCourseErrorAction