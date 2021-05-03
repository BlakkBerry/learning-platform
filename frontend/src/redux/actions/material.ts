import {Dispatch} from "redux";
import {
    CommonCourse,
    CommonLesson,
    CommonModule,
    CommonTask,
    MaterialAction,
    MaterialActionTypes
} from "../../types/common";
import {authAxios} from "../../utils/axios";
import {Course} from "../../types/course";
import {Module} from "../../types/module";
import {Lesson} from "../../types/lesson";
import {Task} from "../../types/task";
import {HomeTask} from "../../types/hometask";

export const fetchMaterials = () => {
    return async (dispatch: Dispatch<MaterialAction>) => {
        try {
            dispatch({type: MaterialActionTypes.FETCH_MATERIALS})

            const coursesResponse = await authAxios.get<Array<Course>>('/courses/')
            const courses = coursesResponse.data

            let commonCourses: Array<CommonCourse> = []

            courses.forEach(async (course) => {
                const modulesResponse = await authAxios.get<Array<Module>>(`/courses/${course.id}/modules/`)
                const modules = modulesResponse.data

                let commonModules: Array<CommonModule> = []

                modules.forEach(async (module) => {
                    const lessonsResponse = await authAxios.get<Array<Lesson>>(`/courses/${course.id}/modules/${module.id}/lessons/`)
                    const lessons = lessonsResponse.data

                    let commonLessons: Array<CommonLesson> = []

                    lessons.forEach(async (lesson) => {
                        const tasksResponse = await authAxios.get<Array<Task>>(`/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}/tasks/`)
                        const tasks = tasksResponse.data

                        let commonTasks: Array<CommonTask> = []

                        tasks.forEach(async (task) => {
                            const homeTasksResponse = await authAxios.get<Array<HomeTask>>(`/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}/tasks/${task.id}/home_tasks/`)
                            const homeTasks = homeTasksResponse.data

                            const commonTask: CommonTask = {
                                ...task,
                                homeTasks: homeTasks
                            }

                            commonTasks.push(commonTask)
                        })

                        const commonLesson: CommonLesson = {
                            ...lesson,
                            tasks: commonTasks
                        }

                        commonLessons.push(commonLesson)
                    })

                    const commonModule: CommonModule = {
                        ...module,
                        lessons: commonLessons
                    }

                    commonModules.push(commonModule)
                })

                const commonCourse: CommonCourse = {
                    ...course,
                    modules: commonModules
                }

                commonCourses.push(commonCourse)
            })
            dispatch({type: MaterialActionTypes.FETCH_MATERIALS_SUCCESS, payload: commonCourses})

        } catch (error) {
            dispatch({
                type: MaterialActionTypes.FETCH_MATERIALS_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch materials'}
            })
        }
    }
}