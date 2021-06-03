import React, {useEffect, useState} from 'react';
import {authAxios} from "../../../../utils/axios";
import {Course} from "../../../../types/course";
import {Col, List, Progress, Row} from "antd";
import {Link} from "react-router-dom";
import CourseItem from "../Courses/CourseItem";

const ProgressPage = () => {

    const [bundle, setBundle] = useState<Course[]>([])

    const columns = [
        {
            title: 'Task',
            dataIndex: 'task',
            key: 'task'
        }
    ]

    useEffect(() => {
        authAxios.get<Course[]>(`http://127.0.0.1:8000/api/get_student_bundle/`).then(res => {
            setBundle(res.data)
        })
    }, [])

    const countTasks = (course: Course) => {
        let tasks = 0
        course.modules?.forEach(module => module.lessons?.forEach(lesson => tasks += lesson.tasks?.length || 0))
        return tasks
    }

    const countHomeTasks = (course: Course) => {
        let homeTasks = 0
        course.modules?.forEach(module => module.lessons?.forEach(lesson => lesson.tasks?.forEach(task => {
            homeTasks += (task as any).home_task?.length || 0
        })))
        return homeTasks
    }

    const image = (course: Course) => <Progress key={course.id}
                                                type="circle"
                                                percent={((countHomeTasks(course) * 100) / countTasks(course) || 0)}/>
    return <>
        <h1>Progress</h1>
        <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}} justify={'center'}>
            {bundle.map(course => {
                return <Col className="gutter-row" span={6} style={{display: 'flex', justifyContent: 'center'}}>
                    <Link to={`/courses/${course.id}`}>
                        <div style={{textAlign: 'center', width: '100%'}}>
                            <h3>{course.name}</h3>
                            <Progress key={course.id}
                                      type="circle"
                                      percent={((countHomeTasks(course) * 100) / countTasks(course) || 0)}/>
                            <p className="m-t-5">{course.description}</p>
                        </div>
                    </Link>
                </Col>
            })}
        </Row>
    </>
};

export default ProgressPage;
