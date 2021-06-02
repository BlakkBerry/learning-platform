import React, {FC, useState} from 'react';
import {Avatar, Badge, Button, Drawer, List, Spin} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {HomeTask} from "../../../../../types/hometask";

interface HomeworkReviewProps {
    homeTasks: HomeTask[]
    loading: boolean
}

const HomeworkReview: FC<HomeworkReviewProps> = ({homeTasks, loading}) => {

    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    return (
        <>
            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                <Badge count={homeTasks?.length} style={{backgroundColor: '#2db7f5'}}>
                    <Button size='middle' onClick={showDrawer}>Requests</Button>
                </Badge>
            </div>
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
                    dataSource={homeTasks}
                    renderItem={homeTask => (
                        <List.Item>
                            {!loading ? <List.Item.Meta
                                avatar={
                                    <Avatar style={{width: "55px", height: "55px"}}
                                            src={homeTask.owner!.photo ? homeTask.owner!.photo
                                                : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}/>
                                }
                                title={
                                    <div>
                                        <div>{homeTask.owner!.username ? homeTask.owner!.username : `user`}</div>
                                        <div className="float-right">
                                            <Button shape="circle" className="mx-1">
                                                <CheckOutlined
                                                    style={{verticalAlign: "baseline", color: "#2db7f5"}}/>
                                            </Button>

                                            <Button shape="circle" className="mx-1" danger>
                                                <CloseOutlined
                                                    style={{verticalAlign: "baseline", paddingBottom: "4px"}}/>
                                            </Button>

                                        </div>
                                    </div>}
                                description={homeTask.description}
                            >
                            </List.Item.Meta> : <div className="spinner"><Spin/></div>}
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};

export default HomeworkReview;
