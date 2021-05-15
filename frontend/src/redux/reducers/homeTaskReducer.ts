import {HomeTask, HomeTaskAction, HomeTaskActionTypes, HomeTaskState} from "../../types/hometask";
import {RequestError} from "../../types/error";

const initialState: HomeTaskState = {
    homeTasks: [],
    loading: false,
    error: null
}

export const homeTaskReducer = (state = initialState, action: HomeTaskAction): HomeTaskState => {
    const setLoading = (): HomeTaskState => ({...state, loading: true, error: null})
    const setTasks = (homeTasks: Array<HomeTask>): HomeTaskState => ({...state, loading: false, error: null, homeTasks})
    const setError = (error: RequestError): HomeTaskState => ({...state, loading: false, error: error})

    switch (action.type) {

        case HomeTaskActionTypes.FETCH_HOMETASKS:
        case HomeTaskActionTypes.CREATE_HOMETASK:
        case HomeTaskActionTypes.UPDATE_HOMETASK:
        case HomeTaskActionTypes.DELETE_HOMETASK:
            return setLoading()

        case HomeTaskActionTypes.FETCH_HOMETASKS_ERROR:
        case HomeTaskActionTypes.CREATE_HOMETASK_ERROR:
        case HomeTaskActionTypes.UPDATE_HOMETASK_ERROR:
        case HomeTaskActionTypes.DELETE_HOMETASK_ERROR:
            return setError(action.payload)

        case HomeTaskActionTypes.FETCH_HOMETASKS_SUCCESS:
            return setTasks(action.payload)

        case HomeTaskActionTypes.CREATE_HOMETASK_SUCCESS:
            return setTasks([...state.homeTasks, action.payload])

        case HomeTaskActionTypes.UPDATE_HOMETASK_SUCCESS:
            return setTasks(state.homeTasks.map(homeTask => {
                if (homeTask.id === action.payload.id) {
                    return action.payload
                }
                return homeTask
            }))

        case HomeTaskActionTypes.DELETE_HOMETASK_SUCCESS:
            return setTasks(state.homeTasks.filter(homeTask => homeTask.id !== action.homeTaskId))

        default:
            return state
    }
}
