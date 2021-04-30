import React, {useState} from 'react';
import {Layout, Menu} from "antd";
import {
    DesktopOutlined, FileOutlined,
    ProfileOutlined,
    RiseOutlined,
    ScheduleOutlined,
    SnippetsOutlined,
    UserOutlined
} from "@ant-design/icons";
const {Sider} = Layout;
const {SubMenu} = Menu;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Home
                </Menu.Item>
                <Menu.Item key="1" icon={<RiseOutlined/>}>
                    Progress
                </Menu.Item>

                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="courses" icon={<ScheduleOutlined/>} title="My Courses">
                    <SubMenu key="courses/1/modules" icon={<ProfileOutlined/>} title="Course 1">
                        <SubMenu key="courses/1/modules/1/lessons" icon={<SnippetsOutlined/>} title="Module 1">
                            <Menu.Item key="courses/1/modules/1/lessons/1">Lesson 1</Menu.Item>
                            <Menu.Item key="courses/1/modules/1/lessons/2">Lesson 2</Menu.Item>
                            <Menu.Item key="courses/1/modules/1/lessons/3">Lesson 3</Menu.Item>
                        </SubMenu>
                        <SubMenu key="courses/1/modules/2/lessons" icon={<SnippetsOutlined/>} title="Module 2">
                            <Menu.Item key="courses/1/modules/2/lessons/1">Lesson 1</Menu.Item>
                            <Menu.Item key="courses/1/modules/2/lessons/2">Lesson 2</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu key="courses/2/modules" icon={<ProfileOutlined/>} title="Course 1">
                        <SubMenu key="courses/2/modules/1/lessons" icon={<SnippetsOutlined/>} title="Module 1">
                            <Menu.Item key="courses/2/modules/1/lessons/1">Lesson 1</Menu.Item>
                            <Menu.Item key="courses/2/modules/1/lessons/2">Lesson 2</Menu.Item>
                            <Menu.Item key="courses/2/modules/1/lessons/3">Lesson 3</Menu.Item>
                        </SubMenu>
                        <SubMenu key="courses/2/modules/2/lessons" icon={<SnippetsOutlined/>} title="Module 2">
                            <Menu.Item key="courses/2/modules/2/lessons/1">Lesson 1</Menu.Item>
                            <Menu.Item key="courses/2/modules/2/lessons/2">Lesson 2</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
