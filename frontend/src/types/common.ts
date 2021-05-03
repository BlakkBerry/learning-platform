import {Course} from "./course";
import {Module} from "./module";
import {HomeTask} from "./hometask";
import {Task} from "./task";
import {Lesson} from "./lesson";
import {RequestError} from "./error";

export interface CommonTask extends Task {
    homeTasks: Array<HomeTask>
}

export interface CommonLesson extends Lesson {
    tasks: Array<CommonTask>
}

export interface CommonModule extends Module {
    lessons: Array<CommonLesson>
}

export interface CommonCourse extends Course {
    modules: Array<CommonModule>
}

interface FetchMaterialsAction {
    type: MaterialActionTypes.FETCH_MATERIALS
}
interface FetchMaterialsSuccess {
    type: MaterialActionTypes.FETCH_MATERIALS_SUCCESS
    payload: Array<CommonCourse>
}
interface FetchMaterialsError {
    type: MaterialActionTypes.FETCH_MATERIALS_ERROR,
    payload: RequestError
}

export interface MaterialState {
    courses: Array<CommonCourse>,
    loading: boolean
    error: RequestError | null
}

export enum MaterialActionTypes {
    FETCH_MATERIALS = 'MATERIAL/FETCH_MATERIALS',
    FETCH_MATERIALS_SUCCESS = 'MATERIAL/FETCH_MATERIALS_SUCCESS',
    FETCH_MATERIALS_ERROR = 'MATERIAL/FETCH_MATERIALS_ERROR',
}

export type MaterialAction =
    FetchMaterialsAction |
    FetchMaterialsSuccess |
    FetchMaterialsError