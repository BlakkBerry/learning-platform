import * as CourseActions from './course'
import * as CourseRequestActions from './request'
import * as ModuleActions from './module'

export const Actions = {
    ...CourseActions,
    ...CourseRequestActions,
    ...ModuleActions
}