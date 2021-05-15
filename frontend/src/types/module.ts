import {RequestError} from "./error";
import {Lesson} from "./lesson";

export interface Module {
    id?: number
    name: string
    description: string
    created?: Date
    lessons?: Array<Lesson>
}

interface FetchModulesAction {
    type: ModuleActionTypes.FETCH_MODULES
}
interface FetchModulesSuccessAction {
    type: ModuleActionTypes.FETCH_MODULES_SUCCESS,
    payload: Array<Module>
}
interface FetchModulesErrorAction {
    type: ModuleActionTypes.FETCH_MODULES_ERROR,
    payload: RequestError
}

interface CreateModuleAction {
    type: ModuleActionTypes.CREATE_MODULE,
}
interface CreateModuleSuccessAction {
    type: ModuleActionTypes.CREATE_MODULE_SUCCESS
    payload: Module
    courseId: number
}
interface CreateModuleErrorAction {
    type: ModuleActionTypes.CREATE_MODULE_ERROR
    payload: RequestError,
}

interface UpdateModuleAction {
    type: ModuleActionTypes.UPDATE_MODULE,
}
interface UpdateModuleSuccessAction {
    type: ModuleActionTypes.UPDATE_MODULE_SUCCESS
    payload: Module
    courseId: number
    moduleId: number
}
interface UpdateModuleErrorAction {
    type: ModuleActionTypes.UPDATE_MODULE_ERROR
    payload: RequestError
}

interface DeleteModuleAction {
    type: ModuleActionTypes.DELETE_MODULE,
}
interface DeleteModuleSuccessAction {
    type: ModuleActionTypes.DELETE_MODULE_SUCCESS
    courseId: number
    moduleId: number
}
interface DeleteModuleErrorAction {
    type: ModuleActionTypes.DELETE_MODULE_ERROR
    payload: RequestError
}

export enum ModuleActionTypes {

    FETCH_MODULES = 'MODULES/FETCH_MODULES',
    FETCH_MODULES_SUCCESS = 'MODULES/FETCH_MODULES_SUCCESS',
    FETCH_MODULES_ERROR = 'MODULES/FETCH_MODULES_ERROR',

    CREATE_MODULE = 'MODULES/CREATE_MODULE',
    CREATE_MODULE_SUCCESS = 'MODULES/CREATE_MODULE_SUCCESS',
    CREATE_MODULE_ERROR = 'MODULES/CREATE_MODULE_ERROR',

    UPDATE_MODULE = 'MODULES/UPDATE_MODULE',
    UPDATE_MODULE_SUCCESS = 'MODULES/UPDATE_MODULE_SUCCESS',
    UPDATE_MODULE_ERROR = 'MODULES/UPDATE_MODULE_ERROR',

    DELETE_MODULE = 'MODULES/DELETE_MODULE',
    DELETE_MODULE_SUCCESS = 'MODULES/DELETE_MODULE_SUCCESS',
    DELETE_MODULE_ERROR = 'MODULES/DELETE_MODULE_ERROR',
}

export interface ModuleState {
    modules: Array<Module>
    loading: boolean
    error: RequestError | null
}

export type ModuleAction =
    FetchModulesAction |
    FetchModulesSuccessAction |
    FetchModulesErrorAction |

    CreateModuleAction |
    CreateModuleSuccessAction |
    CreateModuleErrorAction |

    UpdateModuleAction |
    UpdateModuleSuccessAction |
    UpdateModuleErrorAction |

    DeleteModuleAction |
    DeleteModuleSuccessAction |
    DeleteModuleErrorAction
