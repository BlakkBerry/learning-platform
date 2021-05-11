import React from 'react';
import {Module} from "../../../../../../types/module";
import {Card} from "antd";
import {DesktopOutlined, FileOutlined, RiseOutlined} from "@ant-design/icons";
import {Meta} from "antd/es/list/Item";

const ModuleItem = (module: Module) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    className="card__image"
                    height={200}
                    alt={module.name}
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
                title={module.name}
                description={module.description}
            />
        </Card>
    );
};

export default ModuleItem;
