import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {Course} from "../../../../../types/course";
import {Task} from "../../../../../types/task";
import {authAxios} from "../../../../../utils/axios";
import {useActions} from "../../../../../hooks/useActions";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {Button, Collapse, DatePicker, Form, Input, Menu, Modal, notification, Spin} from "antd";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {isAuthor} from "../../../../../utils/functions";
import moment from 'moment';
import TaskDiscussion from "./TaskDiscussion";
import HomeTaskModal from "./HomeworkModal";
import HomeworkReview from "./HomeworkReview";

const {SubMenu} = Menu;
const {TextArea} = Input;
const {Panel} = Collapse

const TaskPage = () => {
    const {courseId, moduleId, lessonId, id}: any = useParams()
    const [course, setCourse] = useState<Course>()
    const [task, setTask] = useState<Task>()

    const {error} = useTypedSelector(state => state.tasks)
    const {homeTasks, loading: homeTasksLoading, error: homeTasksError} = useTypedSelector(state => state.homeTasks)

    const {updateTask, deleteTask, clearError, fetchHomeTasks} = useActions()
    const history = useHistory()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${courseId}/`).then(res => {
            setCourse(res.data)
        })

        authAxios.get<Task>(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${id}/`).then(res => {
            setTask(res.data)
        })

        fetchHomeTasks(courseId, moduleId, lessonId, id)

        return () => {
            clearError()
        }

    }, [])

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

    if (error) {
        notification.open({
            message: 'Error',
            icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
            description: error.message,
        })
    }

    const author: boolean = isAuthor(course!)

    return (
        <>
            {author ?
                <>
                    <HomeworkReview homeTasks={homeTasks} task={task} courseId={courseId} moduleId={moduleId}
                                    lessonId={lessonId} taskId={id} author={author}/>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel key="1" header="Task details">
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
                                    <Input type="number" placeholder="100" disabled={!author}/>
                                </Form.Item>

                                <Form.Item label="Due to"
                                           name="due_date"
                                           initialValue={moment(task.due_date, 'YYYY-MM-DD')}
                                >
                                    <DatePicker format='YYYY-MM-DD' disabled={!author}/>
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
                </>
                :
                <div className="task-details">
                    <h2>{task.name}</h2>
                    <p className="p-l-10">{task.description}</p>
                    <div className="files">
                        FILES
                    </div>
                    <p style={{color: "rgba(0, 0, 0, 0.45)"}}>Due to: {moment(task.due_date).format('YYYY-MM-DD')}</p>
                    <HomeTaskModal courseId={courseId} moduleId={moduleId} lessonId={lessonId} taskId={id}
                                   author={author} homeTasks={homeTasks}/>
                </div>
            }
            <TaskDiscussion courseId={courseId} moduleId={moduleId} lessonId={lessonId} taskId={id}/>
        </>
    )
}

export default TaskPage;
