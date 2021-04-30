import * as UserActions from './user'
import * as CourseActions from './course'
import * as CourseRequestActions from './request'

export const Actions = {
    ...UserActions,
    ...CourseActions,
    ...CourseRequestActions
}