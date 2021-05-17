import React from 'react';
import {DesktopOutlined, FileOutlined, RiseOutlined} from "@ant-design/icons";
import {Meta} from "antd/es/list/Item";
import {Card} from "antd";
import './CourseItem.css'

const CourseItem = (course: any) => {

    return (
        <Card
            hoverable
            cover={
                <img
                    className="card__image"
                    height={200}
                    alt={course.name}
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
                title={course.name}
                description="This is the description"
            />
        </Card>
    );
};

export default CourseItem;
