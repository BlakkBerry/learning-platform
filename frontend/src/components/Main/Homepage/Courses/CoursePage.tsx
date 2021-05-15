import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {authAxios} from "../../../../utils/axios";
import {Course} from "../../../../types/course";
import Modules from "./Modules/Modules";
import {Button, Modal, Input, Menu, Spin} from "antd";
import {isAuthor} from "../../../../utils/functions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";
import {useHistory} from "react-router-dom";
import {ExclamationCircleOutlined} from "@ant-design/icons";

import "./CoursePage.css";

const {SubMenu} = Menu;

const CoursePage = () => {

    const {id}: any = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    let [author, SetAuthor] = useState(false)


    const {requests, error, loading} = useTypedSelector(state => state.requests)
    const {fetchCourseRequests} = useActions()
    const {updateCourse} = useActions()
    const {deleteCourse} = useActions()


    const history = useHistory();

    useEffect(() => {

    })


    useEffect(() => {
        authAxios.get<Course>(`/courses/${id}/`).then(res => {
            setCourse(res.data)

            if (isAuthor(res.data)) {
                SetAuthor(true)
                fetchCourseRequests(id)
            }
        })
    }, [])


    if (!course) {
        return <div className="spinner">
            <Spin/>
        </div>
    }


    const onChange = (event: any) => {
        let {name, value} = event.target

        setCourse(prev => {
            let current: any = {...prev}
            Object.entries({...prev}).map(kv => {
                if (kv[0] === name) {
                    current[name] = value
                }
            })
            return current
        })
    }

    const update = () => {
        const {name, subject, section, description, audience} = course
        const newCourse = {name, subject, section, description, audience}
        updateCourse(id, newCourse)
    }

    const del = () => {
        Modal.confirm({
            title: 'Delete course?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Data could not be recovered',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteCourse(id)
                history.push("/");
            }
        })
    }

    return (
        <div className="container">
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Course details</h1>

            <Input placeholder="Name" addonBefore="Name" name="name" value={course.name} disabled={!author}
                   onChange={event => onChange(event)}
                   className="detail-input"/>
            <Input placeholder="Subject" addonBefore="Subject" name="subject" value={course.subject}
                   onChange={event => onChange(event)}
                   disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Section" addonBefore="Section" name="section" value={course.section}
                   onChange={event => onChange(event)}
                   disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Description" addonBefore="Description" name="description" value={course.description}
                   onChange={event => onChange(event)}
                   disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Audience" addonBefore="Audience" name="audience" value={course.audience}
                   onChange={event => onChange(event)}
                   disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Code" addonBefore="Code" name="code" value={course.code}
                   disabled className="detail-input"/>
            <Input placeholder="Number of students" addonBefore="Students" value={course.students.length}
                   disabled className="detail-input"/>

            <Menu mode="inline" style={{width: 256}}>
                <SubMenu key="sub1" title="Option" disabled={!author}>
                    <Menu.Item key="1" className="menu-item" style={{padding: 0}}>
                        <Button type="primary" block onClick={update}>
                            Save
                        </Button>
                    </Menu.Item>
                    <Menu.Item key="2" className="menu-item" style={{padding: 0}} danger>
                        <Button type="primary" danger block onClick={del}>
                            Delete
                        </Button>
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Modules courseId={id}/>
        </div>
    );
};

export default CoursePage;
