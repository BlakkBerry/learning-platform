import {RequestError} from "./error";
import {User} from "./user";
import {Module} from "./module";

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
    students: Array<User>
    modules?: Array<Module>
}

interface FetchStudentCoursesAction {
    type: CourseActionTypes.FETCH_STUDENT_COURSES
}
interface FetchStudentCoursesSuccessAction {
    type: CourseActionTypes.FETCH_STUDENT_COURSES_SUCCESS
    payload: Array<Course>
}
interface FetchStudentCoursesErrorAction {
    type: CourseActionTypes.FETCH_STUDENT_COURSES_ERROR,
    payload: RequestError
}

interface FetchAuthorCoursesAction {
    type: CourseActionTypes.FETCH_AUTHOR_COURSES,
}
interface FetchAuthorCoursesSuccessAction {
    type: CourseActionTypes.FETCH_AUTHOR_COURSES_SUCCESS
    payload: Array<Course>
}
interface FetchAuthorCoursesErrorAction {
    type: CourseActionTypes.FETCH_AUTHOR_COURSES_ERROR
    payload: RequestError,
}

interface CreateCourseAction {
    type: CourseActionTypes.CREATE_SINGLE_COURSE,
}
interface CreateCourseSuccessAction {
    type: CourseActionTypes.CREATE_SINGLE_COURSE_SUCCESS,
    payload: Course
}
interface CreateCourseErrorAction {
    type: CourseActionTypes.CREATE_SINGLE_COURSE_ERROR
    payload: RequestError,
}

interface UpdateCourseAction {
    type: CourseActionTypes.UPDATE_SINGLE_COURSE,
}
interface UpdateCourseSuccessAction {
    type: CourseActionTypes.UPDATE_SINGLE_COURSE_SUCCESS
    payload: Course
}
interface UpdateCourseErrorAction {
    type: CourseActionTypes.UPDATE_SINGLE_COURSE_ERROR
    payload: RequestError,
}

interface DeleteCourseAction {
    type: CourseActionTypes.DELETE_SINGLE_COURSE,
}
interface DeleteCourseSuccessAction {
    type: CourseActionTypes.DELETE_SINGLE_COURSE_SUCCESS,
    payload: number
}
interface DeleteCourseErrorAction {
    type: CourseActionTypes.DELETE_SINGLE_COURSE_ERROR
    payload: RequestError,
}

export interface CourseState {
    studentCourses: Array<Course>,
    authorCourses: Array<Course>,
    loading: boolean
    error: RequestError | null
}

export enum CourseActionTypes {
    FETCH_STUDENT_COURSES = 'MATERIAL/FETCH_STUDENT_COURSES',
    FETCH_STUDENT_COURSES_SUCCESS = 'MATERIAL/FETCH_STUDENT_COURSES_SUCCESS',
    FETCH_STUDENT_COURSES_ERROR = 'MATERIAL/FETCH_STUDENT_COURSES_ERROR',

    FETCH_AUTHOR_COURSES = 'MATERIAL/FETCH_AUTHOR_COURSES',
    FETCH_AUTHOR_COURSES_SUCCESS = 'MATERIAL/FETCH_AUTHOR_COURSES_SUCCESS',
    FETCH_AUTHOR_COURSES_ERROR = 'MATERIAL/FETCH_AUTHOR_COURSES_ERROR',

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
    FetchStudentCoursesAction |
    FetchStudentCoursesSuccessAction |
    FetchStudentCoursesErrorAction |

    FetchAuthorCoursesAction |
    FetchAuthorCoursesSuccessAction |
    FetchAuthorCoursesErrorAction |

    CreateCourseAction |
    CreateCourseSuccessAction |
    CreateCourseErrorAction |

    UpdateCourseAction |
    UpdateCourseSuccessAction |
    UpdateCourseErrorAction |

    DeleteCourseAction |
    DeleteCourseSuccessAction |
    DeleteCourseErrorAction
