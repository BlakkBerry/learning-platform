import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {Course} from "../../../../../types/course";
import {Task} from "../../../../../types/task";
import {authAxios} from "../../../../../utils/axios";
import {useActions} from "../../../../../hooks/useActions";
import {RequestError} from "../../../../../types/error";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {Button, DatePicker, Form, Input, Menu, Modal, notification, Spin} from "antd";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {isAuthor} from "../../../../../utils/functions";
import moment from 'moment';

const {SubMenu} = Menu;
const {TextArea} = Input;

const TaskPage = () => {
    const {courseId, moduleId, lessonId, id}: any = useParams()
    const [course, setCourse] = useState<Course>()
    const [task, setTask] = useState<Task>()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${courseId}/`).then(res => {
            setCourse(res.data)
        })

        authAxios.get<Task>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${id}/`).then(res => {
            setTask(res.data)
        })
    }, [])

    const {tasks, error, loading} = useTypedSelector(state => state.tasks)
    const {updateTask, deleteTask} = useActions()
    const history = useHistory()

    const prevErrorRef = useRef<RequestError | null>();
    useEffect(() => {
        prevErrorRef.current = error
    })
    const prevError = prevErrorRef.current

    const showError = () => {
        if (error) {
            notification.open({
                message: 'Error',
                icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
                description: error.message,
            })
        }
    }

    const update = (values: Partial<Task> | any) => {
        const date = values.due_date?.format('YYYY-MM-DD')

        updateTask(courseId, moduleId, lessonId, id,
            {...values, due_date: date})

    }

    const del = () => {
        Modal.confirm({
            title: 'Delete task?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Data could not be recovered',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteTask(courseId, moduleId, lessonId, id)
            }
        })
    }

    if (!task) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    if (prevError?.message !== error?.message) {
        showError()
    }

    const author: boolean = isAuthor(course!)
    return (
        <>
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Task details</h1>
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
                    initialValue={task.name}
                >
                    <Input placeholder="Name" addonBefore="Name" disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={task.description}
                >
                    <TextArea disabled={!author} autoSize={{minRows: 6}} showCount maxLength={300}
                              placeholder="Description" className="detail-input"/>
                </Form.Item>

                <Form.Item label="Max score"
                           name="max_score"
                           initialValue={task.max_score}
                >
                    <Input type="number" placeholder="100"/>
                </Form.Item>

                <Form.Item label="Due to"
                           name="due_date"
                           initialValue={moment(task.due_date, 'YYYY-MM-DD')}
                >
                    <DatePicker format='YYYY-MM-DD'/>
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
            {/*HomeTasks*/}
        </>
    );
};

export default TaskPage;
