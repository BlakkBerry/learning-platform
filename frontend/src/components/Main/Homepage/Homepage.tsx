import React, {useEffect, useRef, useState} from 'react';
import Courses from "./Courses/Courses";
import {Button, Drawer, Form, Input, notification, Modal, Spin} from "antd";
import {PlusOutlined, RetweetOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {useActions} from "../../../hooks/useActions";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {Course} from "../../../types/course";
import {RequestError} from "../../../types/error";

const {TextArea} = Input;

const Homepage = () => {

    const code = useRef<any>(null)

    const {requests, error, loading} = useTypedSelector(state => state.requests)
    const {createCourseRequest, createCourse} = useActions()

    const [visible, setVisible] = useState(false);

    const prevErrorRef = useRef<RequestError | null>();
    useEffect(() => {
        prevErrorRef.current = error
    })
    const prevError = prevErrorRef.current

    const onSubmit = (values: any) => {
        const data: Partial<Course> = {...values}
        createCourse(data)
        onClose()
    }

    function codeInput() {
        return (
            <Input type="text" ref={(instance) => code.current = instance} placeholder="Code"/>
        )
    }

    function courseInput() {
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
                            message: 'Please input course name!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Name"/>
                </Form.Item>

                <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[
                        {
                            required: true,
                            message: 'Please course subject!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Subject"/>
                </Form.Item>

                <Form.Item label="Section" name="section">
                    <Input type="text" placeholder="Section"/>
                </Form.Item>

                <Form.Item label="Audience" name="audience">
                    <Input type="text" placeholder="Audience"/>
                </Form.Item>

                <Form.Item name="description">
                    <TextArea autoSize={{minRows: 6}} showCount maxLength={300} placeholder="Description"/>
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

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const showError = () => {
        if (error) {
            notification.open({
                message: 'Error',
                icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
                description: error.message,
            })
        }
    }

    const connect = () => {
        Modal.confirm({
            title: 'Enter code to your course',
            icon: '',
            content: codeInput(),

            onOk() {
                createCourseRequest(code.current?.state.value)
            }
        })
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
            <div>
                <div style={{position: "absolute", right: 0}} className="px-5 mr-3 float-right">
                    <Button className="px-5 mr-3" type="primary" shape="round"
                            onClick={showDrawer}
                            icon={<PlusOutlined style={{verticalAlign: "baseline"}}/>}
                            size='large'>Create</Button>
                    <Button onClick={connect} className="px-5 mx-3" type="primary" shape="round"
                            icon={<RetweetOutlined style={{verticalAlign: "baseline"}}/>}
                            size='large'>Connect</Button>
                </div>

                <Drawer
                    title="Enter course details"
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    width={"35vw"}
                >
                    {courseInput()}
                </Drawer>
                <Courses isAuthor={false}/>
                <Courses isAuthor={true}/>
            </div>
        </>
    );
};

export default Homepage;
