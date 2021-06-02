import React, {FC, useEffect, useState} from 'react';
import {Button, Form, Input, Modal, notification, Upload} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useActions} from "../../../../../hooks/useActions";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from '@ant-design/icons';
import HomeworkReview from "./HomeworkReview";

interface HomeTaskModalProps {
    courseId: number
    moduleId: number
    lessonId: number
    taskId: number
    author: boolean
}

const HomeTaskModal: FC<HomeTaskModalProps> = ({courseId, moduleId, lessonId, taskId, author}) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const {homeTasks, loading, error} = useTypedSelector(state => state.homeTasks)
    const [form] = Form.useForm()
    const {createHomeTask, fetchHomeTasks, clearError, updateHomeTask} = useActions()

    useEffect(() => {
        fetchHomeTasks(courseId, moduleId, lessonId, taskId)

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
            form={form}
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
                       className="detail-input"/>
            </Form.Item>

            <Form.Item
                name="description"
                initialValue={homeTasks[0]?.description}
            >
                <TextArea autoSize={{minRows: 6}} showCount maxLength={300}
                          placeholder="Description" className="detail-input"/>
            </Form.Item>

            <Upload defaultFileList={[]}>
                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
            </Upload>

            <Form.Item>
                <Button type="primary" htmlType="submit" className={"m-t-10"}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    }

    const submitModal = (values: any) => {
        setIsModalVisible(false)
        if (homeTasks[0]) {
            updateHomeTask(courseId, moduleId, lessonId, taskId, homeTasks[0].id!, values)
        } else {
            createHomeTask(courseId, moduleId, lessonId, taskId, values)
            form.resetFields()
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
