import React, {FC, useEffect, useRef, useState} from 'react';
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {useActions} from "../../../../../hooks/useActions";
import {Button, Drawer, Form, Input, List, notification, Spin} from "antd";
import {Link} from "react-router-dom";
import LessonItem from "./LessonItem";
import {PlusOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {RequestError} from "../../../../../types/error";
import {Lesson} from "../../../../../types/lesson";


const {TextArea} = Input;

interface LessonsProps {
    courseId: number,
    moduleId: number,
    author: boolean
}

const Lessons: FC<LessonsProps> = ({courseId, moduleId, author}) => {
    const {lessons, loading, error} = useTypedSelector(state => state.lessons)
    const [visible, setVisible] = useState(false);

    const prevErrorRef = useRef<RequestError | null>();
    useEffect(() => {
        prevErrorRef.current = error
    })
    const prevError = prevErrorRef.current

    const {fetchLessons, createLesson} = useActions()

    useEffect(() => {
        fetchLessons(courseId, moduleId)
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

    const onSubmit = (values: any) => {
        const data: Partial<Lesson> = {...values}
        createLesson(courseId, moduleId, data)
        onClose()
    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    function lessonInput() {
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
                            message: 'Please input lesson name!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Name"/>
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


    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    if (prevError?.message !== error?.message) {
        showError()
    }

    return <>
        {author && <Button className="px-5 mr-3 float-right" type="primary" shape="round"
                           onClick={showDrawer}
                           icon={<PlusOutlined style={{verticalAlign: "baseline"}}/>}
                           size='large'>Create</Button>}
        <Drawer
            title="Enter lesson details"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={"35vw"}
        >
            {lessonInput()}
        </Drawer>
        <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Lessons</h1>
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4
            }}
            dataSource={lessons}
            renderItem={lesson => (
                <List.Item>
                    <Link to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}>
                        <LessonItem {...lesson}/>
                    </Link>
                </List.Item>
            )}
        />
    </>;
};

export default Lessons;
