import React, {FC, useEffect} from 'react';
import {List, Spin} from "antd";
import Course from "./Course/Course";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";
import './Courses.css'
import {Link, useHistory} from "react-router-dom"

interface CoursesProps {
    isAuthor: boolean
}

const Courses: FC<CoursesProps> = ({isAuthor}) => {

    const {authorCourses, studentCourses, loading, error} = useTypedSelector(state => state.courses)
    const {fetchAuthorMaterials, fetchStudentCourses} = useActions()
    const history = useHistory()

    useEffect(() => {
        if (isAuthor) {
            fetchAuthorMaterials()
        } else {
            fetchStudentCourses()
        }
    }, [])

    if (error) {

        if (error.code === 401) {
            history.push('/login')
            return null
        }

        return <h1 color="red">{error.message}</h1>
    }

    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    return <>
        <h1 style={{textAlign: 'center', fontSize: '2rem'}}>{isAuthor ? 'Created Courses' : 'My Courses'}</h1>
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4
            }}
            dataSource={isAuthor ? authorCourses : studentCourses}
            renderItem={course => (
                <List.Item>
                    <Link to={`/courses/${course.id}`}>
                        <Course {...course}/>
                    </Link>
                </List.Item>
            )}
        />
    </>;
};

export default Courses;
