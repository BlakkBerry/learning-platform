import React from 'react';
import {Task} from "../../../../../types/task";
import {Card} from "antd";
import {DesktopOutlined, FileOutlined, RiseOutlined} from "@ant-design/icons";
import {Meta} from "antd/es/list/Item";

const TaskItem = (task: Task) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    className="card__image"
                    height={200}
                    alt={task.name}
                    src={'https://i.stack.imgur.com/y9DpT.jpg'}
                />
            }
            actions={[
                <FileOutlined key="setting"/>,
                <RiseOutlined key="edit"/>,
                <DesktopOutlined key="ellipsis"/>,
            ]}
        >
            <Meta
                title={task.name}
                description={task.description}
            />
        </Card>
    );
};

export default TaskItem;
