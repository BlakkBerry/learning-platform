import {HomeTask} from "./hometask";
import {Loadable, Throwable} from "./common";
import {RequestError} from "./error";

export interface Task {
    id?: number
    name: string
    description?: string
    max_score: number
    dueDate?: Date
    homeTasks?: Array<HomeTask>
}

interface FetchTasksAction extends Loadable {
    type: TaskActionTypes.FETCH_TASKS
}
interface FetchTasksSuccessAction {
    type: TaskActionTypes.FETCH_TASKS_SUCCESS,
    payload: Array<Task>
}
interface FetchTasksErrorAction extends Throwable {
    type: TaskActionTypes.FETCH_TASKS_ERROR,
    payload: RequestError
}

interface CreateTaskAction extends Loadable {
    type: TaskActionTypes.CREATE_TASK
}
interface CreateTaskSuccessAction {
    type: TaskActionTypes.CREATE_TASK_SUCCESS,
    payload: Task
}
interface CreateTaskErrorAction extends Throwable {
    type: TaskActionTypes.CREATE_TASK_ERROR,
    payload: RequestError
}

interface UpdateTaskAction extends Loadable {
    type: TaskActionTypes.UPDATE_TASK
}
interface UpdateTaskSuccessAction {
    type: TaskActionTypes.UPDATE_TASK_SUCCESS,
    payload: Task
}
interface UpdateTaskErrorAction extends Throwable {
    type: TaskActionTypes.UPDATE_TASK_ERROR,
    payload: RequestError
}

interface DeleteTaskAction extends Loadable {
    type: TaskActionTypes.DELETE_TASK
}
interface DeleteTaskSuccessAction {
    type: TaskActionTypes.DELETE_TASK_SUCCESS,
    taskId: number
}
interface DeleteTaskErrorAction extends Throwable {
    type: TaskActionTypes.DELETE_TASK_ERROR,
    payload: RequestError
}

export enum TaskActionTypes {

    FETCH_TASKS = 'TASKS/FETCH_TASKS',
    FETCH_TASKS_SUCCESS = 'TASKS/FETCH_TASKS_SUCCESS',
    FETCH_TASKS_ERROR = 'TASKS/FETCH_TASKS_ERROR',

    CREATE_TASK = 'TASKS/CRATE_TASK',
    CREATE_TASK_SUCCESS = 'TASKS/CRATE_TASK_SUCCESS',
    CREATE_TASK_ERROR = 'TASKS/CRATE_TASK_ERROR',

    UPDATE_TASK = 'TASKS/UPDATE_TASK',
    UPDATE_TASK_SUCCESS = 'TASKS/UPDATE_TASK_SUCCESS',
    UPDATE_TASK_ERROR = 'TASKS/UPDATE_TASK_ERROR',

    DELETE_TASK = 'TASKS/DELETE_TASK',
    DELETE_TASK_SUCCESS = 'TASKS/DELETE_TASK_SUCCESS',
    DELETE_TASK_ERROR = 'TASKS/DELETE_TASK_ERROR',
}

export interface TaskState {
    tasks: Array<Task>
    loading: boolean
    error: RequestError | null
}

export type TaskAction =
    FetchTasksAction |
    FetchTasksSuccessAction |
    FetchTasksErrorAction |

    CreateTaskAction |
    CreateTaskSuccessAction |
    CreateTaskErrorAction |

    UpdateTaskAction |
    UpdateTaskSuccessAction |
    UpdateTaskErrorAction |

    DeleteTaskAction |
    DeleteTaskSuccessAction |
    DeleteTaskErrorAction
