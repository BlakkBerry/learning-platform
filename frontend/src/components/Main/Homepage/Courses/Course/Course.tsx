import React from 'react';
import {DesktopOutlined, FileOutlined, RiseOutlined} from "@ant-design/icons";
import {Meta} from "antd/es/list/Item";
import {Card} from "antd";
import './Course.css'

const Course = (course: any) => { // TODO fix props type

    return (
        <Card
            hoverable
            cover={
                <img
                    className="card__image"
                    height={200}
                    alt={course.title}
                    src={course.image || 'https://i.stack.imgur.com/y9DpT.jpg'}
                />
            }
            actions={[
                <FileOutlined key="setting"/>,
                <RiseOutlined key="edit"/>,
                <DesktopOutlined key="ellipsis"/>,
            ]}
        >
            <Meta
                title={course.title}
                description="This is the description"
            />
        </Card>
    );
};

export default Course;
