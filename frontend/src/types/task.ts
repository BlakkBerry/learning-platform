import {HomeTask} from "./hometask";
import {RequestError} from "./error";
import {User} from "./user";

export interface Task {
    id?: number
    name: string
    description?: string
    max_score: number
    due_date?: Date
    homeTasks?: Array<HomeTask>
}

export interface TaskDiscussionMessage {
    id: number
    user: User
    discussion: number
    text: string | number
    sent_at: Date
}

interface FetchTasksAction {
    type: TaskActionTypes.FETCH_TASKS
}
interface FetchTasksSuccessAction {
    type: TaskActionTypes.FETCH_TASKS_SUCCESS,
    payload: Array<Task>
}
interface FetchTasksErrorAction {
    type: TaskActionTypes.FETCH_TASKS_ERROR,
    payload: RequestError
}

interface CreateTaskAction {
    type: TaskActionTypes.CREATE_TASK
}
interface CreateTaskSuccessAction {
    type: TaskActionTypes.CREATE_TASK_SUCCESS,
    payload: Task
}
interface CreateTaskErrorAction {
    type: TaskActionTypes.CREATE_TASK_ERROR,
    payload: RequestError
}

interface UpdateTaskAction {
    type: TaskActionTypes.UPDATE_TASK
}
interface UpdateTaskSuccessAction {
    type: TaskActionTypes.UPDATE_TASK_SUCCESS,
    payload: Task
}
interface UpdateTaskErrorAction {
    type: TaskActionTypes.UPDATE_TASK_ERROR,
    payload: RequestError
}

interface DeleteTaskAction {
    type: TaskActionTypes.DELETE_TASK
}
interface DeleteTaskSuccessAction {
    type: TaskActionTypes.DELETE_TASK_SUCCESS,
    taskId: number
}
interface DeleteTaskErrorAction {
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
