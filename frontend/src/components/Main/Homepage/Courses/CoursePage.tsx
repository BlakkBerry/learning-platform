import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {authAxios} from "../../../../utils/axios";
import {Course} from "../../../../types/course";
import Modules from "./Modules/Modules";
import {Button, Modal, Input, Menu, Spin, Form} from "antd";
import {isAuthor} from "../../../../utils/functions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";
import {useHistory} from "react-router-dom";
import {ExclamationCircleOutlined} from "@ant-design/icons";

import "./CoursePage.css";

const {SubMenu} = Menu;
const {TextArea} = Input;

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

    const update = (values: any) => {
        let data = {...values}
        delete data.code
        delete data.students
        updateCourse(id, data)
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
            }
        })
    }

    return (
        <>
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Course details</h1>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={update}
            >
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input course name!',
                        },
                    ]}
                    initialValue={course.name}
                >
                    <Input placeholder="Name" addonBefore="Name" disabled={!author}
                           className="detail-input"/>
                </Form.Item>


                <Form.Item
                    name="subject"
                    rules={[
                        {
                            required: true,
                            message: 'Please input course subject!',
                        },
                    ]}
                    initialValue={course.subject}
                >
                    <Input placeholder="Subject" addonBefore="Subject"
                           disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="section"
                    initialValue={course.section}
                >
                    <Input placeholder="Section" addonBefore="Section"
                           disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="audience"
                    initialValue={course.audience}
                >
                    <Input placeholder="Audience" addonBefore="Audience" value={course.audience}
                           disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="code"
                    initialValue={course.code}
                >
                    <Input placeholder="Code" addonBefore="Code"
                           disabled
                           className="detail-input"/>
                </Form.Item>
                <Form.Item
                    name="students"
                    initialValue={course.students.length}
                >
                    <Input placeholder="Number of students" addonBefore="Students"
                           disabled className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={course.description}
                >
                    <TextArea disabled={!author} autoSize={{minRows: 6}} showCount maxLength={300}
                              placeholder="Description"/>
                </Form.Item>

                {author && <Menu mode="inline" style={{width: 256}}>
                    <SubMenu key="sub1" title="Option">
                        <Menu.Item key="1" className="menu-item" style={{padding: 0}}>
                            <Button type="primary" block htmlType="submit">
                                Save
                            </Button>
                        </Menu.Item>
                        <Menu.Item key="2" className="menu-item" style={{padding: 0}} danger>
                            <Button type="primary" danger block onClick={del}>
                                Delete
                            </Button>
                        </Menu.Item>
                    </SubMenu>
                </Menu>}
            </Form>
            <Modules courseId={id} author={author}/>
        </>
    );
};

export default CoursePage;
