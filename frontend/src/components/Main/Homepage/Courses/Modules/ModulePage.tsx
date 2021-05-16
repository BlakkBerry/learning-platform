import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {Module} from "../../../../../types/module";
import {authAxios} from "../../../../../utils/axios";
import {Button, Form, Input, Menu, Modal, notification, Spin} from "antd";
import {Course} from "../../../../../types/course";
import {isAuthor} from "../../../../../utils/functions";
import Lessons from "./Lessons/Lessons";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useActions} from "../../../../../hooks/useActions";
import {useHistory} from "react-router-dom";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {RequestError} from "../../../../../types/error";

const {SubMenu} = Menu;
const {TextArea} = Input;

const ModulePage = () => {

    const {courseId, id}: any = useParams()
    const [course, setCourse] = useState<Course>()
    const [module, setModule] = useState<Module>()
    const history = useHistory();

    useEffect(() => {
        authAxios.get<Course>(`/courses/${courseId}/`).then(res => {
            setCourse(res.data)
        })

        authAxios.get<Module>(`/courses/${courseId}/modules/${id}/`).then(res => {
            setModule(res.data)
        })
    }, [])

    const {requests, error, loading} = useTypedSelector(state => state.requests)
    const {updateModule, deleteModule} = useActions()


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

    const update = (values: any) => {
        updateModule(courseId, id, {...values})
    }

    const del = () => {
        Modal.confirm({
            title: 'Delete module?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Data could not be recovered',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteModule(courseId, id)
                // history.goBack()
            }
        })
    }

    if (!module) {
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
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Module details</h1>

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
                            message: 'Please input module name!',
                        },
                    ]}
                    initialValue={module.name}
                >
                    <Input placeholder="Name" addonBefore="Name" disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={module.description}
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
            <Lessons courseId={courseId} moduleId={module.id!} author={author}/>
        </>
    );
};

export default ModulePage;
