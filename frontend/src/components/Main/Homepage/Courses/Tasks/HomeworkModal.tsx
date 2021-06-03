import React, {FC, useEffect, useState} from 'react';
import {Button, Form, Input, Modal, notification, Upload} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useActions} from "../../../../../hooks/useActions";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from '@ant-design/icons';
import {HomeTask} from "../../../../../types/hometask";
import './HomeworkModal.css'
import {authAxios} from "../../../../../utils/axios";

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


    const [fileList, setFileList] = useState<any[]>([])

    const onRemove = (file: any) => {
        authAxios.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/home_tasks/${homeTasks[0].id}/files/${file.id}/`)
            .then(response => {
                const newFileList = fileList.filter(item => item.uid != file.uid)
                setFileList([...newFileList])
            })
    }

    const uploadFile = (file: any) => {
        const formData = new FormData()
        formData.append('file_item', file)
        formData.append('title', file.name)

        const newFileList = [{
            uid: file.uid,
            id: null,
            name: file.name,
            status: 'uploading',
            url: ''
        }]
        setFileList([...fileList, ...newFileList])

        authAxios.post(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/tasks/${taskId}/home_tasks/${homeTasks[0].id}/files/`, formData)
            .then(response => {
                setFileList(prevState => prevState.map(item => {
                    if (item.uid == file.uid)
                        return {...item, id: response.data.id, status: 'done', url: response.data.file_item,}
                    return item
                }))
                return response
            })
            .catch(error => {
                const res = fileList.filter(item => item.uid != file.uid)
                const current = fileList.filter(item => item.uid == file.uid)
                setFileList([...res, {...current, status: 'error'}])
            })
    }

    const settings = {
        multiple: false,
    }


    useEffect(() => {
        if (homeTasks.length) {
            const initialData = homeTasks[0].file?.map(file => ({
                id: file.id,
                name: file.title,
                status: 'done',
                url: file.file_item
            })) as any
            setFileList(initialData)
        }
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

            {homeTasks.length ?
                <Upload {...settings} fileList={fileList} onRemove={onRemove}
                        customRequest={({file}) => uploadFile(file)}>
                    <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                </Upload> : null
            }

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
        if (homeTasks.length) {
            updateHomeTask(courseId, moduleId, lessonId, taskId, homeTasks[0].id!, values)
            setFileList([...fileList])
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
