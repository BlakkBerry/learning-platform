export interface ClearErrorAction {
    type: CommonActionTypes.CLEAR_ERROR
}

export enum CommonActionTypes {
    CLEAR_ERROR = 'COMMON/CLEAR_ERROR'
}

export type CommonAction = ClearErrorAction
