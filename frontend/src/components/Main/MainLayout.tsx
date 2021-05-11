import React, {FC, ReactChild, ReactNode} from "react";
import {Layout, Breadcrumb} from 'antd';
import './MainLayout.css'
import {Content, Footer} from "antd/es/layout/layout";
import Sidebar from "./Sidebar/Sidebar";

interface IProps {
    children: ReactNode | ReactChild
}

const MainLayout: FC<IProps> = ({children}) => {

    return <Layout style={{minHeight: '100vh'}}>

        <Sidebar/>
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
                {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
                {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
                {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                {/*</Breadcrumb>*/}
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {children}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    </Layout>
}

export default MainLayout;
