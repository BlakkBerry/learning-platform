interface FetchUsersAction {
    type: UserActionTypes.FETCH_USERS
}

interface FetchUsersSuccessAction {
    type: UserActionTypes.FETCH_USERS_SUCCESS
    payload: Array<any> // TODO Array of user type
}

interface FetchUsersErrorAction {
    type: UserActionTypes.FETCH_USERS_ERROR
    payload: string // TODO error type
}

export interface UserState {
    users: Array<any> // TODO Create user type
    loading: boolean
    error: string | null // TODO Create error type
}

export enum UserActionTypes {
    FETCH_USERS = 'USERS/FETCH_USERS',
    FETCH_USERS_SUCCESS = 'USERS/FETCH_USERS_SUCCESS',
    FETCH_USERS_ERROR = 'USERS/FETCH_USERS_ERROR',
}

export type UserAction = FetchUsersAction | FetchUsersSuccessAction | FetchUsersErrorAction