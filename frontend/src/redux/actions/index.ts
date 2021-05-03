import * as CourseActions from './course'
import * as CourseRequestActions from './request'
import * as ModuleActions from './module'
import * as MaterialActions from './material'

export const Actions = {
    ...CourseActions,
    ...CourseRequestActions,
    ...ModuleActions,
    ...MaterialActions
}