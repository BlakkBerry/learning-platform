import * as CourseActions from './course'
import * as CourseRequestActions from './request'
import * as ModuleActions from './module'
import * as LessonAction from './lesson'
import * as TaskAction from './task'
import * as HomeTaskAction from './hometask'
import * as CommonActions from './common'

export const Actions = {
    ...CourseActions,
    ...CourseRequestActions,
    ...ModuleActions,
    ...LessonAction,
    ...TaskAction,
    ...HomeTaskAction,
    ...CommonActions
}
