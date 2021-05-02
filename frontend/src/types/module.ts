import {RequestError} from "./error";

export interface Module {
    id?: number
    name: string
    description: string
    created?: Date
}

interface CreateModuleAction {
    type: ModuleActionTypes.CREATE_MODULE
}
interface CreateModuleSuccessAction {
    type: ModuleActionTypes.CREATE_MODULE_SUCCESS
    payload: Module
    courseId: number
}
interface CreateModuleErrorAction {
    type: ModuleActionTypes.CREATE_MODULE_ERROR
    payload: RequestError
}

interface GetModulesForCourse {
    type: ModuleActionTypes.GET_MODULES_FOR_COURSE
}
interface GetModulesForCourseSuccess {
    type: ModuleActionTypes.GET_MODULES_FOR_COURSE_SUCCESS
    payload: Array<Module>
    courseId: number
}
interface GetModulesForCourseError {
    type: ModuleActionTypes.GET_MODULES_FOR_COURSE_ERROR
    payload: RequestError
}

export interface ModulesInCourse {
    [key: number]: Array<Module>
}

export interface ModuleState {
    modules: ModulesInCourse
    loading: boolean
    error: RequestError | null
}

export enum ModuleActionTypes {

    GET_MODULES_FOR_COURSE = 'MODULES/GET_MODULES_FOR_COURSE',
    GET_MODULES_FOR_COURSE_SUCCESS = 'MODULES/GET_MODULES_FOR_COURSE_SUCCESS',
    GET_MODULES_FOR_COURSE_ERROR = 'MODULES/GET_MODULES_FOR_COURSE_ERROR',

    CREATE_MODULE = 'MODULES/CREATE_MODULE',
    CREATE_MODULE_SUCCESS = 'MODULES/CREATE_MODULE_SUCCESS',
    CREATE_MODULE_ERROR = 'MODULES/CREATE_MODULE_ERROR',
}

export type ModuleAction =
    CreateModuleAction |
    CreateModuleSuccessAction |
    CreateModuleErrorAction |
    GetModulesForCourse |
    GetModulesForCourseSuccess |
    GetModulesForCourseError