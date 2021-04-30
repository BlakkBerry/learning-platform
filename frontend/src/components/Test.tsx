import React, {useEffect} from "react";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {Course} from "../types/course";

const TestComponent: React.FC = () => {
    const {courses, loading, error} = useTypedSelector(state => state.courses)
    const requestState = useTypedSelector(state => state.requests)
    const requests = requestState.requests
    const requestsLoading = requestState.loading
    const requestsError = requestState.error

    const {
        fetchCourses,
        createCourse,
        deleteCourse,
        updateCourse,
        createCourseRequest
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

    const partialCourse: Partial<Course> = {
        name: "string2"
    }

    useEffect(() => {
        fetchCourses()
    }, [])

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
        <button onClick={() => createCourseRequest("ukT6SG")}>Send Request</button>
        <ul id="users">
            {courses.map(course => <li key={course.id}>{course.author + course.name}</li>)}
        </ul>
    </div>
}

export default TestComponent