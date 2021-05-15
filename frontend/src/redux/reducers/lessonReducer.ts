import {RequestError} from "../../types/error";
import {Lesson, LessonAction, LessonActionTypes, LessonState} from "../../types/lesson";

const initialState: LessonState = {
    lessons: [],
    loading: false,
    error: null
}

export const lessonReducer = (state = initialState, action: LessonAction): LessonState => {
    const setLoading = (): LessonState => ({...state, loading: true, error: null})
    const setLessons = (lessons: Array<Lesson>): LessonState => ({...state, loading: false, error: null, lessons})
    const setError = (error: RequestError): LessonState => ({...state, loading: false, error: error})

    switch (action.type) {

        case LessonActionTypes.FETCH_LESSONS:
        case LessonActionTypes.CREATE_LESSON:
        case LessonActionTypes.UPDATE_LESSON:
        case LessonActionTypes.DELETE_LESSON:
            return setLoading()

        case LessonActionTypes.FETCH_LESSONS_ERROR:
        case LessonActionTypes.CREATE_LESSON_ERROR:
        case LessonActionTypes.UPDATE_LESSON_ERROR:
        case LessonActionTypes.DELETE_LESSON_ERROR:
            return setError(action.payload)

        case LessonActionTypes.FETCH_LESSONS_SUCCESS:
            return setLessons(action.payload)

        case LessonActionTypes.CREATE_LESSON_SUCCESS:
            return setLessons([...state.lessons, action.payload])

        case LessonActionTypes.UPDATE_LESSON_SUCCESS:
            return setLessons(state.lessons.map(lesson => {
                if (lesson.id === action.lessonId) {
                    return action.payload
                }
                return lesson
            }))

        case LessonActionTypes.DELETE_LESSON_SUCCESS:
            return setLessons(state.lessons.filter(lesson => lesson.id !== action.lessonId))

        default:
            return state
    }
}
