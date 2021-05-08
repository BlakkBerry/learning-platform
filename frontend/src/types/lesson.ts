import {Task} from "./task";
import {Loadable, Throwable} from "./common";
import {RequestError} from "./error";

export interface Lesson {
    id?: number
    name: string
    description?: string
    created?: Date
    tasks?: Array<Task>
}

interface FetchLessonsAction extends Loadable {
    type: LessonActionTypes.FETCH_LESSONS
}
interface FetchLessonsSuccessAction {
    type: LessonActionTypes.FETCH_LESSONS_SUCCESS,
    payload: Array<Lesson>
}
interface FetchLessonsErrorAction extends Throwable {
    type: LessonActionTypes.FETCH_LESSONS_ERROR,
    payload: RequestError
}

interface CreateLessonAction extends Loadable {
    type: LessonActionTypes.CREATE_LESSON
}
interface CreateLessonSuccessAction {
    type: LessonActionTypes.CREATE_LESSON_SUCCESS,
    payload: Lesson
}
interface CreateLessonErrorAction extends Throwable {
    type: LessonActionTypes.CREATE_LESSON_ERROR,
    payload: RequestError
}

interface UpdateLessonAction extends Loadable {
    type: LessonActionTypes.UPDATE_LESSON
}
interface UpdateLessonSuccessAction {
    type: LessonActionTypes.UPDATE_LESSON_SUCCESS,
    payload: Lesson,
    lessonId: number
}
interface UpdateLessonErrorAction extends Throwable {
    type: LessonActionTypes.UPDATE_LESSON_ERROR,
    payload: RequestError
}

interface DeleteLessonAction extends Loadable {
    type: LessonActionTypes.DELETE_LESSON
}
interface DeleteLessonSuccessAction {
    type: LessonActionTypes.DELETE_LESSON_SUCCESS,
    lessonId: number
}
interface DeleteLessonErrorAction extends Throwable {
    type: LessonActionTypes.DELETE_LESSON_ERROR,
    payload: RequestError
}

export enum LessonActionTypes {

    FETCH_LESSONS = 'LESSONS/FETCH_LESSONS',
    FETCH_LESSONS_SUCCESS = 'LESSONS/FETCH_LESSONS_SUCCESS',
    FETCH_LESSONS_ERROR = 'LESSONS/FETCH_LESSONS_ERROR',

    CREATE_LESSON = 'LESSONS/CREATE_LESSON',
    CREATE_LESSON_SUCCESS = 'LESSONS/CREATE_LESSON_SUCCESS',
    CREATE_LESSON_ERROR = 'LESSONS/CREATE_LESSON_ERROR',

    UPDATE_LESSON = 'LESSONS/UPDATE_LESSON',
    UPDATE_LESSON_SUCCESS = 'LESSONS/UPDATE_LESSON_SUCCESS',
    UPDATE_LESSON_ERROR = 'LESSONS/UPDATE_LESSON_ERROR',

    DELETE_LESSON = 'LESSONS/DELETE_LESSON',
    DELETE_LESSON_SUCCESS = 'LESSONS/DELETE_LESSON_SUCCESS',
    DELETE_LESSON_ERROR = 'LESSONS/DELETE_LESSON_ERROR',
}

export interface LessonState {
    lessons: Array<Lesson>
    loading: boolean,
    error: RequestError | null
}

export type LessonAction =

    FetchLessonsAction |
    FetchLessonsSuccessAction |
    FetchLessonsErrorAction |

    CreateLessonAction |
    CreateLessonSuccessAction |
    CreateLessonErrorAction |

    UpdateLessonAction |
    UpdateLessonSuccessAction |
    UpdateLessonErrorAction |

    DeleteLessonAction |
    DeleteLessonSuccessAction |
    DeleteLessonErrorAction
