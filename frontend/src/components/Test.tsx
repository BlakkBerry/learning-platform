import React, {useEffect} from "react";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {Course} from "../types/course";
import {Module} from "../types/module";
import Test2 from "./Test2";

const TestComponent: React.FC = () => {
    const {courses, loading, error} = useTypedSelector(state => state.courses)
    const materialState = useTypedSelector(state => state.materials)
    const materials = materialState.courses
    const materialsLoading = materialState.loading
    const materialsError = materialState.error

    const requestState = useTypedSelector(state => state.requests)
    const requests = requestState.requests
    const requestsLoading = requestState.loading
    const requestsError = requestState.error


    const {
        fetchCourses,
        createCourse,
        deleteCourse,
        updateCourse,
        createCourseRequest,
        getRequestsForCourse,
        deleteCourseRequest,
        createModule,
        fetchMaterials
    } = useActions()

    const course: Course = {
        name: "string2",
        description: "string2",
        subject: "string2",
        section: "string2",
        audience: "string2",
        students: [],
        author: 1
    }
    const module: Module = {
        name: 'Module hello',
        description: 'Desc hello'
    }

    const partialCourse: Partial<Course> = {
        name: "string2"
    }

    useEffect(() => {
        // fetchCourses()
        fetchMaterials()
    }, [])

    console.log(materials)

    if (loading || requestsLoading) {
        return <div style={{color: 'blue'}}>Loading...</div>
    }

    if (error) {
        return <div style={{color: 'red'}}>{error.message}</div>
    }
    if (requestsError) {
        return <div style={{color: 'red'}}>{requestsError.message}</div>
    }

    return <div>
        <button onClick={() => createCourse(course)}>Create</button>
        <button onClick={() => deleteCourse(2)}>Delete</button>
        <button onClick={() => updateCourse(5, partialCourse)}>Update</button>
        <button onClick={() => createModule(1, module)}>Create module</button>
        <ul id="users">
            {courses.map(course => <li key={course.id}>{course.author + course.name}
                <Test2 id={course.id}/>
            </li>)}
        </ul>

        <button onClick={() => createCourseRequest("1IuXdq")}>Send Request</button>
        <button onClick={() => getRequestsForCourse(1)}>Get Requests (course 1)</button>
        <button onClick={() => deleteCourseRequest(1, 5)}>Delete Request (course 1, request 5)</button>
        <ul id="users">
            {requests.map(request => <li key={request.id}>{request.id} - {request.student.email}</li>)}
        </ul>
    </div>
}

export default TestComponent