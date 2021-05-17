import React, {FC, useEffect} from 'react';
import {List, notification, Spin} from "antd";
import CourseItem from "./CourseItem";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {ExclamationCircleOutlined} from "@ant-design/icons";

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

        notification.open({
            message: 'Error',
            icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
            description: error.message,
        })
    }

    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    return <>
        <h1 style={{textAlign: 'center', fontSize: '2rem', paddingTop:"40px"}}>{isAuthor ? 'Created Courses' : 'My Courses'}</h1>
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
                        <CourseItem {...course}/>
                    </Link>
                </List.Item>
            )}
        />
    </>;
};

export default Courses;
