import {combineReducers} from "redux";
import {userReducer} from "./userReducer";
import {courseReducer} from "./courseReducer";
import {requestReducer} from "./requestReducer";

export const rootReducer = combineReducers({
    users: userReducer,
    courses: courseReducer,
    requests: requestReducer
})

export type RootState = ReturnType<typeof rootReducer>