import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {authAxios} from "../../../../utils/axios";
import {Course} from "../../../../types/course";
import {Request} from "../../../../types/request";
import Modules from "./Modules/Modules";
import {Button, Modal, Input, Menu, Spin, Form, Badge, Drawer, List, Avatar} from "antd";
import {isAuthor} from "../../../../utils/functions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";
import {useHistory} from "react-router-dom";
import {ExclamationCircleOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";

import "./CoursePage.css";
import {AppDispatch, store, useAppDispatch} from "../../../../redux";
import {fetchCourseRequests} from "../../../../redux/actions/request";

const {SubMenu} = Menu;
const {TextArea} = Input;

const CoursePage = () => {

    const {id}: any = useParams()
    const [course, setCourse] = useState<Course | null>(null)
    const [courseRequests, setCourseRequests] = useState<Request[]>([])
    let [author, SetAuthor] = useState(false)
    const [visible, setVisible] = useState(false);

    const {error, loading} = useTypedSelector(state => state.requests)
    const {updateCourse, deleteCourse, acceptCourseRequest, deleteCourseRequest} = useActions()

    const history = useHistory();

    const dispatch: AppDispatch = useAppDispatch()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${id}/`).then(res => {
            setCourse(res.data)

            if (isAuthor(res.data)) {
                SetAuthor(true)
                dispatch(fetchCourseRequests(id)).then(() => {
                    setCourseRequests(store.getState().requests.requests)
                })
            }
        })
    }, [])

    const acceptRequest = (request: Request) => {
        try {
            dispatch(acceptCourseRequest(id, request.id)).then()
        } catch (e) {

        }
    }

    const deleteRequest = (request: Request) => {
        try {
            dispatch(deleteCourseRequest(id, request.id)).then()
        } catch (e) {

        }
    }

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const update = (values: any) => {
        let data = {...values}
        delete data.code
        delete data.students
        updateCourse(id, data)
    }

    const del = () => {
        Modal.confirm({
            title: 'Delete course?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Data could not be recovered',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteCourse(id)
            }
        })
    }

    if (!course) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    return (
        <>

            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Course details</h1>

            <Badge className="float-right" count={courseRequests?.length} style={{backgroundColor: '#2db7f5'}}>
                <Button size='middle' onClick={showDrawer}>Requests</Button>
            </Badge>
            <Drawer
                title="Requests"
                placement="right"
                onClose={onClose}
                visible={visible}
                width={"35vw"}
                closable
            >
                <List
                    itemLayout="vertical"
                    dataSource={courseRequests}
                    renderItem={request => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar style={{width: "55px", height: "55px"}}
                                            src={request.student.photo ? request.student.photo
                                                : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}/>
                                }
                                title={
                                    <div>
                                        <div>{request.student.username ? request.student.username : `user${request.id}`}</div>
                                        <div className="float-right">
                                            <Button shape="circle" className="mx-1"
                                                    onClick={() => acceptRequest(request)}>
                                                <CheckOutlined
                                                    style={{verticalAlign: "baseline", color: "#2db7f5"}}/>
                                            </Button>

                                            <Button shape="circle" className="mx-1" danger
                                                    onClick={() => deleteRequest(request)}>
                                                <CloseOutlined
                                                    style={{verticalAlign: "baseline", paddingBottom: "4px"}}/>
                                            </Button>

                                        </div>
                                    </div>}
                                description={request.student.email}
                            >
                            </List.Item.Meta>
                        </List.Item>
                    )}
                />
            </Drawer>
            <Form
                style={{paddingTop: "40px"}}
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
                            message: 'Please input course name!',
                        },
                    ]}
                    initialValue={course.name}
                >
                    <Input placeholder="Name" addonBefore="Name" disabled={!author}
                           className="detail-input"/>
                </Form.Item>


                <Form.Item
                    name="subject"
                    rules={[
                        {
                            required: true,
                            message: 'Please input course subject!',
                        },
                    ]}
                    initialValue={course.subject}
                >
                    <Input placeholder="Subject" addonBefore="Subject"
                           disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="section"
                    initialValue={course.section}
                >
                    <Input placeholder="Section" addonBefore="Section"
                           disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="audience"
                    initialValue={course.audience}
                >
                    <Input placeholder="Audience" addonBefore="Audience" value={course.audience}
                           disabled={!author}
                           className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="code"
                    initialValue={course.code}
                >
                    <Input placeholder="Code" addonBefore="Code"
                           disabled
                           className="detail-input"/>
                </Form.Item>
                <Form.Item
                    name="students"
                    initialValue={course.students.length}
                >
                    <Input placeholder="Number of students" addonBefore="Students"
                           disabled className="detail-input"/>
                </Form.Item>

                <Form.Item
                    name="description"
                    initialValue={course.description}
                >
                    <TextArea disabled={!author} autoSize={{minRows: 6}} showCount maxLength={300}
                              placeholder="Description"/>
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
            <Modules courseId={id} author={author}/>
        </>
    );
};

export default CoursePage;
