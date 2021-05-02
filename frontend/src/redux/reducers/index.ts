import {combineReducers} from "redux";
import {courseReducer} from "./courseReducer";
import {requestReducer} from "./requestReducer";
import {moduleReducer} from "./moduleReducer";

export const rootReducer = combineReducers({
    courses: courseReducer,
    modules: moduleReducer,
    requests: requestReducer
})

export type RootState = ReturnType<typeof rootReducer>