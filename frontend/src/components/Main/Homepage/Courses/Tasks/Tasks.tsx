import React, {FC, useEffect, useRef, useState} from 'react';
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {RequestError} from "../../../../../types/error";
import {useActions} from "../../../../../hooks/useActions";
import {Button, DatePicker, Drawer, Form, Input, List, notification, Spin} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {Task} from "../../../../../types/task";
import moment from "moment";

const {TextArea} = Input;

interface TasksProps {
    courseId: number,
    moduleId: number,
    lessonId: number,
    author: boolean
}

const Tasks: FC<TasksProps> = ({courseId, moduleId, lessonId, author}) => {

    const {tasks, error, loading} = useTypedSelector(state => state.tasks)
    const [visible, setVisible] = useState(false);
    const prevErrorRef = useRef<RequestError | null>();
    useEffect(() => {
        prevErrorRef.current = error
    })
    const prevError = prevErrorRef.current

    const {fetchTasks, createTask} = useActions()

    useEffect(() => {
        fetchTasks(courseId, moduleId, lessonId)
    }, [])

    const showError = () => {
        if (error) {
            notification.open({
                message: 'Error',
                icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
                description: error.message,
            })
        }
    }

    const onSubmit = (values: Partial<Task> | any) => {
        const date = values.due_date?.format('YYYY-MM-DD')

        const data: Partial<Task> = {
            ...values,
            due_date: date
        }

        createTask(courseId, moduleId, lessonId, data)
        onClose()
    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    function taskInput() {
        return (
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input task date!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Name"/>
                </Form.Item>

                <Form.Item name="description">
                    <TextArea autoSize={{minRows: 6}} showCount maxLength={300} placeholder="Description"/>
                </Form.Item>

                <Form.Item label="Max score"
                           name="max_score"
                           rules={[
                               {
                                   required: true,
                                   message: 'Please input task date!',
                               },
                           ]}
                >
                    <Input type="number" placeholder="100"/>
                </Form.Item>

                <Form.Item label="Due to"
                           name="due_date"
                           rules={[
                               {
                                   required: true,
                                   message: 'Please input task date!',
                               },
                           ]}
                >
                    <DatePicker format='YYYY-MM-DD' />
                </Form.Item>

                <Form.Item className="float-right">
                    <Button type="default" className="ml-3" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" className="mx-3" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }


    if (prevError?.message !== error?.message) {
        showError()
    }

    return (
        <>
            {author && <Button className="px-5 mr-3 float-right" type="primary" shape="round"
                               onClick={showDrawer}
                               icon={<PlusOutlined style={{verticalAlign: "baseline"}}/>}
                               size='large'>Create</Button>}

            <Drawer
                title="Enter task details"
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={"35vw"}
            >
                {taskInput()}
            </Drawer>

            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Tasks</h1>
            <List
                itemLayout="horizontal"
                dataSource={tasks}
                renderItem={task => (
                    <List.Item>
                        <List.Item.Meta
                            title={<Link to={`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${task.id}`}>{task.name}</Link>}
                            description={task.description}
                        />
                        <span style={{color: "rgba(0, 0, 0, 0.45)"}}>{'Due to: ' + moment(task.due_date).format('YYYY-MM-DD')}</span>
                    </List.Item>
                )}
            />
        </>
    );
};

export default Tasks;
