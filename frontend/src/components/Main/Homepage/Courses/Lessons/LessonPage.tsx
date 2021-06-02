import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Course} from "../../../../../types/course";
import {Lesson} from "../../../../../types/lesson";
import {authAxios} from "../../../../../utils/axios";
import {Button, Collapse, Form, Input, Menu, Modal, notification, Spin} from "antd";
import {isAuthor} from "../../../../../utils/functions";
import {useActions} from "../../../../../hooks/useActions";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import Tasks from "../Tasks/Tasks";

const {SubMenu} = Menu;
const {TextArea} = Input;
const {Panel} = Collapse;

const LessonPage = () => {
    const {courseId, moduleId, id}: any = useParams()
    const [course, setCourse] = useState<Course>()
    const [lesson, setLesson] = useState<Lesson>()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${courseId}/`).then(res => {
            setCourse(res.data)
        })

        authAxios.get<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${id}/`).then(res => {
            setLesson(res.data)
        })

        return () => {
            clearError()
        }
    }, [])

    const {requests, error, loading} = useTypedSelector(state => state.requests)
    const {updateLesson, deleteLesson, clearError} = useActions()
    const history = useHistory()


    const update = (values: any) => {
        updateLesson(courseId, moduleId, id, {...values})
    }

    const del = () => {
        Modal.confirm({
            title: 'Delete lesson?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Data could not be recovered',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteLesson(courseId, moduleId, id)
                // history.goBack()
            }
        })
    }


    if (!lesson) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    const author: boolean = isAuthor(course!)

    if (error) {
        notification.open({
            message: 'Error',
            icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
            description: error.message,
        })
    }

    return (
        <>
            <Collapse defaultActiveKey={['1']} className="m-b-10">
                <Panel key="1" header="Lesson details">
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
                                    message: 'Please input lesson name!',
                                },
                            ]}
                            initialValue={lesson.name}
                        >
                            <Input placeholder="Name" addonBefore="Name" disabled={!author}
                                   className="detail-input"/>
                        </Form.Item>

                        <Form.Item
                            name="description"
                            initialValue={lesson.description}
                        >
                            <TextArea disabled={!author} autoSize={{minRows: 6}} showCount maxLength={300}
                                      placeholder="Description" className="detail-input"/>
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
                </Panel>
            </Collapse>
            <Tasks courseId={courseId} moduleId={moduleId} lessonId={lesson.id!} author={author}/>
        </>
    );
};

export default LessonPage;
