import {RequestError} from "../../types/error";
import {Task, TaskAction, TaskActionTypes, TaskState} from "../../types/task";

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null
}

export const taskReducer = (state = initialState, action: TaskAction): TaskState => {
    const setLoading = (): TaskState => ({...state, loading: true, error: null})
    const setTasks = (tasks: Array<Task>): TaskState => ({...state, loading: false, error: null, tasks})
    const setError = (error: RequestError): TaskState => ({...state, loading: false, error: error})

    switch (action.type) {

        case TaskActionTypes.FETCH_TASKS:
        case TaskActionTypes.CREATE_TASK:
        case TaskActionTypes.UPDATE_TASK:
        case TaskActionTypes.DELETE_TASK:
            return setLoading()

        case TaskActionTypes.FETCH_TASKS_ERROR:
        case TaskActionTypes.CREATE_TASK_ERROR:
        case TaskActionTypes.UPDATE_TASK_ERROR:
        case TaskActionTypes.DELETE_TASK_ERROR:
            return setError(action.payload)

        case TaskActionTypes.FETCH_TASKS_SUCCESS:
            return setTasks(action.payload)

        case TaskActionTypes.CREATE_TASK_SUCCESS:
            return setTasks([...state.tasks, action.payload])

        case TaskActionTypes.UPDATE_TASK_SUCCESS:
            return setTasks(state.tasks.map(task => {
                if (task.id === action.payload.id) {
                    return action.payload
                }
                return task
            }))

        case TaskActionTypes.DELETE_TASK_SUCCESS:
            return setTasks(state.tasks.filter(task => task.id !== action.taskId))
        default:
            return state
    }
}
