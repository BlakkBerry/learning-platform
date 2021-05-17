import React from 'react';
import {Lesson} from "../../../../../types/lesson";
import {Card} from "antd";
import {DesktopOutlined, FileOutlined, RiseOutlined} from "@ant-design/icons";
import {Meta} from "antd/es/list/Item";

const LessonItem = (lesson: Lesson) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    className="card__image"
                    height={200}
                    alt={lesson.name}
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
                title={lesson.name}
                description={lesson.description}
            />
        </Card>
    );
};

export default LessonItem;
