import {combineReducers} from "redux";
import {courseReducer} from "./courseReducer";
import {requestReducer} from "./requestReducer";
import {moduleReducer} from "./moduleReducer";
import {materialReducer} from "./materialReducer";

export const rootReducer = combineReducers({
    courses: courseReducer,
    modules: moduleReducer,
    requests: requestReducer,
    materials: materialReducer
})

export type RootState = ReturnType<typeof rootReducer>