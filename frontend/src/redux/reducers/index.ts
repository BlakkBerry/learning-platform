import {combineReducers} from "redux";
import {requestReducer} from "./requestReducer";
import {courseReducer} from "./courseReducer";
import {moduleReducer} from "./moduleReducer";
import {lessonReducer} from "./lessonReducer";
import {taskReducer} from "./taskReducer";
import {homeTaskReducer} from "./homeTaskReducer";

export const rootReducer = combineReducers({
    courses: courseReducer,
    modules: moduleReducer,
    lessons: lessonReducer,
    tasks: taskReducer,
    homeTasks: homeTaskReducer,
    requests: requestReducer
})

export type RootState = ReturnType<typeof rootReducer>
