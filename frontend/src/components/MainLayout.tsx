import React, {FC, ReactChild, ReactNode, useState} from "react";
import {Layout, Menu, Breadcrumb} from 'antd';
import {
    DesktopOutlined,
    RiseOutlined,
    FileOutlined,
    UserOutlined,
    ProfileOutlined,
    SnippetsOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import './MainLayout.css'

const {Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

interface IProps {
    children: ReactNode | ReactChild
}

const MainLayout: FC<IProps> = ({children}) => {

    const [collapsed, setCollapsed] = useState(false);

    return <Layout style={{minHeight: '100vh'}}>
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
        <Layout className="site-layout">
            {/*<Header className="header">*/}
            {/*    <div className="logo" />*/}
            {/*    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>*/}
            {/*        <Menu.Item key="1">nav 1</Menu.Item>*/}
            {/*        <Menu.Item key="2">nav 2</Menu.Item>*/}
            {/*        <Menu.Item key="3">nav 3</Menu.Item>*/}
            {/*    </Menu>*/}
            {/*</Header>*/}
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {children}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    </Layout>
}

export default MainLayout;
