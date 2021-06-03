import React, {FC, useEffect, useRef, useState} from 'react';
import {Avatar, Badge, Button, Drawer, Form, InputNumber, List, Modal, notification, Spin} from "antd";
import {HomeTask} from "../../../../../types/hometask";
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {Task} from "../../../../../types/task";
import {useActions} from "../../../../../hooks/useActions";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import Files from "../../CourseFiles/Files";

interface HomeworkReviewProps {
    homeTasks: HomeTask[]
    task: Task
    courseId: number
    moduleId: number
    lessonId: number
    taskId: number
    author: boolean
}

const HomeworkReview: FC<HomeworkReviewProps> = ({homeTasks, task, courseId, moduleId, lessonId, taskId, author}) => {

    const [visible, setVisible] = useState(false);
    const {loading, error} = useTypedSelector(state => state.homeTasks)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const {updateHomeTask, clearError} = useActions()

    useEffect(() => {
        return () => {
            clearError()
        }
    }, [])

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const putMark = (homeTask: HomeTask, values: Partial<HomeTask>) => {
        updateHomeTask(courseId, moduleId, lessonId, taskId, homeTask.id!, {...homeTask, ...values})
        setIsModalVisible(false)
    }


    if (error) {
        notification.open({
            message: 'Error',
            icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
            description: error.message,
        })
    }

    return (
        <>
            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                <Badge count={homeTasks.filter(task => !task.mark).length} style={{backgroundColor: '#2db7f5'}}>
                    <Button size='middle' onClick={showDrawer}>Home Tasks</Button>
                </Badge>
            </div>
            <Drawer
                title="Home Tasks"
                placement="right"
                onClose={onClose}
                visible={visible}
                width={"35vw"}
                closable
            >
                <List
                    itemLayout="vertical"
                    dataSource={homeTasks}
                    renderItem={homeTask => (
                        <>
                            <List.Item>
                                {!loading ? <List.Item.Meta
                                    avatar={
                                        <Avatar style={{width: "55px", height: "55px"}}
                                                src={homeTask.owner!.photo ? homeTask.owner!.photo
                                                    : "https://www.pngkit.com/png/full/320-3209421_jianxiong-tao-superintendent-anonymous-person.png"}/>
                                    }
                                    title={
                                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                            <div>
                                                <div>{homeTask.owner!.username}</div>
                                                <div>{homeTask.owner!.email}</div>
                                            </div>
                                            <Badge dot={!homeTask.mark}
                                                   style={{backgroundColor: '#2db7f5'}}>
                                                <Button onClick={() => setIsModalVisible(true)}>
                                                    Check
                                                </Button>
                                            </Badge>
                                        </div>}
                                    description={homeTask.owner!.username ? homeTask.owner!.username : `homework ${homeTask.id}`}
                                >
                                </List.Item.Meta> : <div className="spinner"><Spin/></div>}
                            </List.Item>
                            <Modal title="Check Homework"
                                   visible={isModalVisible}
                                   onCancel={() => setIsModalVisible(false)}
                                   footer={null}>
                                <h4>{homeTask.name}</h4>
                                <p>{homeTask.description}</p>
                                <div className="files">
                                    <Files author={author} homeTask={homeTask}/>
                                </div>
                                <Form name="basic"
                                      initialValues={{
                                          remember: true,
                                      }}
                                      onFinish={values => putMark(homeTask, values)}>
                                    <Form.Item name="mark"
                                               rules={[
                                                   {
                                                       required: true,
                                                       message: 'Please input the mark!',
                                                   }
                                               ]}
                                               initialValue={homeTask.mark || task.max_score}
                                    >
                                        <InputNumber min={0}
                                                     max={task.max_score}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className={"m-t-10"}
                                                style={{float: 'right'}}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </>
                    )}
                />
            </Drawer>
        </>
    );
};

export default HomeworkReview;
