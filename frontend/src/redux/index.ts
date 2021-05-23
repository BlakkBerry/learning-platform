import {composeWithDevTools} from "redux-devtools-extension";
import {AnyAction, applyMiddleware, createStore, Dispatch} from "redux";
import { useDispatch } from 'react-redux'
import {rootReducer, RootState} from "./reducers";
import thunk, {ThunkDispatch} from "redux-thunk";

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export type AppDispatch = Dispatch<AnyAction> & ThunkDispatch<RootState, null, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatch>()