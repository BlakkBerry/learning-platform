import {RequestError} from "./error";
import {User} from "./user";

export interface HomeTask {
    id?: number
    name: string
    description?: string
    mark?: number
    owner?: User
    assignment?: string
}

export interface FetchHomeTasksAction {
    type: HomeTaskActionTypes.FETCH_HOMETASKS
}
export interface FetchHomeTasksSuccessAction {
    type: HomeTaskActionTypes.FETCH_HOMETASKS_SUCCESS,
    payload: Array<HomeTask>
}
export interface FetchHomeTasksErrorAction {
    type: HomeTaskActionTypes.FETCH_HOMETASKS_ERROR,
    payload: RequestError
}

export interface CreateHomeTaskAction {
    type: HomeTaskActionTypes.CREATE_HOMETASK
}
export interface CreateHomeTaskSuccessAction {
    type: HomeTaskActionTypes.CREATE_HOMETASK_SUCCESS,
    payload: HomeTask
}
export interface CreateHomeTaskErrorAction {
    type: HomeTaskActionTypes.CREATE_HOMETASK_ERROR,
    payload: RequestError
}

export interface UpdateHomeTaskAction {
    type: HomeTaskActionTypes.UPDATE_HOMETASK
}
export interface UpdateHomeTaskSuccessAction {
    type: HomeTaskActionTypes.UPDATE_HOMETASK_SUCCESS,
    payload: HomeTask
}
export interface UpdateHomeTaskErrorAction {
    type: HomeTaskActionTypes.UPDATE_HOMETASK_ERROR,
    payload: RequestError
}

export interface DeleteHomeTaskAction {
    type: HomeTaskActionTypes.DELETE_HOMETASK
}
export interface DeleteHomeTaskSuccessAction {
    type: HomeTaskActionTypes.DELETE_HOMETASK_SUCCESS,
    homeTaskId: number
}
export interface DeleteHomeTaskErrorAction {
    type: HomeTaskActionTypes.DELETE_HOMETASK_ERROR,
    payload: RequestError
}

export enum HomeTaskActionTypes {
    FETCH_HOMETASKS = 'HOMETASKS/FETCH_HOMETASKS',
    FETCH_HOMETASKS_SUCCESS = 'HOMETASKS/FETCH_HOMETASKS_SUCCESS',
    FETCH_HOMETASKS_ERROR = 'HOMETASKS/FETCH_HOMETASKS_ERROR',

    CREATE_HOMETASK = 'HOMETASKS/CREATE_HOMETASK',
    CREATE_HOMETASK_SUCCESS = 'HOMETASKS/CREATE_HOMETASK_SUCCESS',
    CREATE_HOMETASK_ERROR = 'HOMETASKS/CREATE_HOMETASK_ERROR',

    UPDATE_HOMETASK = 'HOMETASKS/UPDATE_HOMETASK',
    UPDATE_HOMETASK_SUCCESS = 'HOMETASKS/UPDATE_HOMETASK_SUCCESS',
    UPDATE_HOMETASK_ERROR = 'HOMETASKS/UPDATE_HOMETASK_ERROR',

    DELETE_HOMETASK = 'HOMETASKS/DELETE_HOMETASK',
    DELETE_HOMETASK_SUCCESS = 'HOMETASKS/DELETE_HOMETASK_SUCCESS',
    DELETE_HOMETASK_ERROR = 'HOMETASKS/DELETE_HOMETASK_ERROR',
}

export interface HomeTaskState {
    homeTasks: Array<HomeTask>,
    loading: boolean,
    error: RequestError | null
}


export type HomeTaskAction =
    FetchHomeTasksAction |
    FetchHomeTasksSuccessAction |
    FetchHomeTasksErrorAction |

    CreateHomeTaskAction |
    CreateHomeTaskSuccessAction |
    CreateHomeTaskErrorAction |

    UpdateHomeTaskAction |
    UpdateHomeTaskSuccessAction |
    UpdateHomeTaskErrorAction |

    DeleteHomeTaskAction |
    DeleteHomeTaskSuccessAction |
    DeleteHomeTaskErrorAction
