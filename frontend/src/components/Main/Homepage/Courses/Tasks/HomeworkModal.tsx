import React, {FC, useEffect, useState} from 'react';
import {Badge, Button, Form, Input, Modal, notification, Upload} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useActions} from "../../../../../hooks/useActions";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from '@ant-design/icons';
import {HomeTask} from "../../../../../types/hometask";
import './HomeworkModal.css'

interface HomeTaskModalProps {
    courseId: number
    moduleId: number
    lessonId: number
    taskId: number
    author: boolean
    homeTasks: HomeTask[]
}

const HomeTaskModal: FC<HomeTaskModalProps> = ({courseId, moduleId, lessonId, taskId, author, homeTasks}) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const {loading, error} = useTypedSelector(state => state.homeTasks)
    const {createHomeTask, clearError, updateHomeTask} = useActions()

    useEffect(() => {
        return () => {
            clearError()
        }
    }, [])

    const homeTaskStudentForm = () => {
        return <Form
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={submitModal}
        >
            <Form.Item
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input home task name!',
                    },
                ]}
                initialValue={homeTasks[0]?.name}
            >
                <Input placeholder="Name"
                       className="detail-input"
                />
            </Form.Item>

            <Form.Item
                name="description"
                initialValue={homeTasks[0]?.description}
            >
                <TextArea autoSize={{minRows: 6}} showCount maxLength={300}
                          placeholder="Description" className="detail-input"
                />
            </Form.Item>

            <Upload defaultFileList={[]}>
                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
            </Upload>

            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className={"m-t-10"}>
                        Submit
                    </Button>
                </Form.Item>
                {homeTasks[0]?.mark && <div className="mark">{homeTasks[0]?.mark}</div>}
            </div>
        </Form>
    }

    const submitModal = (values: any) => {
        setIsModalVisible(false)
        if (homeTasks[0]) {
            updateHomeTask(courseId, moduleId, lessonId, taskId, homeTasks[0].id!, values)
        } else {
            createHomeTask(courseId, moduleId, lessonId, taskId, values)
        }
    }

    if (error) {
        notification.open({
            message: 'Error',
            icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
            description: error.message,
        })
    }

    return <>
        <Button type="primary" shape="round"
                icon={!homeTasks.length && <PlusOutlined style={{verticalAlign: "baseline"}}/>}
                size='large'
                onClick={() => {
                    setIsModalVisible(true)
                }}
        >{homeTasks.length ? 'View homework' : 'Add homework'}</Button>


        <Modal title="Add Homework"
               visible={isModalVisible}
               onCancel={() => setIsModalVisible(false)}
               footer={null}>
            {homeTaskStudentForm()}
        </Modal>
    </>
};

export default HomeTaskModal;
