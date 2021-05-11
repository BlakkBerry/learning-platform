import React, {useEffect} from "react";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {Course} from "../types/course";
import {Module} from "../types/module";
import {Lesson} from "../types/lesson";

const TestComponent: React.FC = () => {
    const {authorCourses, studentCourses, loading, error} = useTypedSelector(state => state.courses)
    const {modules, error: modulesError, loading: modulesLoading} = useTypedSelector(state => state.modules)
    const {lessons, error: lessonsError, loading: lessonsLoading} = useTypedSelector(state => state.lessons)
    const {tasks, error: tasksError, loading: tasksLoading} = useTypedSelector(state => state.tasks)
    const {homeTasks, error: homeTasksError, loading: homeTasksLoading} = useTypedSelector(state => state.homeTasks)


    const {
        createCourse,
        deleteCourse,
        updateCourse,
        createModule,
        fetchAuthorMaterials,
        updateModule,
        deleteModule,
        createLesson,
        fetchModules,
        fetchLessons,
        fetchTasks,
        fetchHomeTasks
    } = useActions()

    const course: Course = {
        name: "new Course",
        description: "string2",
        subject: "string2",
        section: "string2",
        audience: "string2",
        students: [],
    }
    const module: Module = {
        name: 'Module 2',
        description: 'Desc hello'
    }
    const lesson: Lesson = {
        name: "My Lesson"
    }

    const partialCourse: Partial<Course> = {
        name: "string2"
    }

    useEffect(() => {
        fetchAuthorMaterials()
        // fetchModules(1)
        // fetchLessons(1, 1)
        // fetchTasks(1, 1, 1)
        // fetchHomeTasks(1, 1, 1, 1)
    }, [])

    if (loading) {
        return <div style={{color: 'blue'}}>Loading...</div>
    }

    if (error) {
        return <div style={{color: 'red'}}>{error.message}</div>
    }

    return <div>
        <button onClick={() => createCourse(course)}>Create</button>
        <button onClick={() => deleteCourse(7)}>Delete</button>
        <button onClick={() => updateCourse(5, partialCourse)}>Update</button>

        <ul id="users">
            {authorCourses.map(course => <li key={course.id}>{course.id} {course.name}
                <ul id="users">
                    {course.modules?.map(module => <li key={module.id}>
                        {module.id} - {module.name}
                        <ul>
                            {module.lessons?.map(lesson => <li key={lesson.id}>
                                {lesson.id} - {lesson.name}
                            </li>)}
                        </ul>
                    </li>)}
                </ul>
            </li>)}
        </ul>


        <h1>MODULES</h1>
        <button onClick={() => createModule(1, module)}>Create module</button>
        <button onClick={() => updateModule(1, 2, module)}>Update module</button>
        <button onClick={() => deleteModule(1, 27)}>Delete module</button>
        <ul>
            {modules.map(module => <li key={module.id}>{module.id} - {module.name}</li>)}
        </ul>

        <h1>LESSONS</h1>
        <button onClick={() => createLesson(1, 1, lesson)}>Create Lesson</button>
        <ul>
            {lessons.map(lesson => <li key={lesson.id}>{lesson.id} - {lesson.name}</li>)}
        </ul>

        <h1>TASKS</h1>
        <ul>
            {tasks.map(task => <li key={task.id}>{task.id} - {task.name}</li>)}
        </ul>

        <h1>HOME TASKS</h1>
        <ul>
            {homeTasks.map(homeTask => <li key={homeTask.id}>{homeTask.id} - {homeTask.name}</li>)}
        </ul>
    </div>
}

export default TestComponent
