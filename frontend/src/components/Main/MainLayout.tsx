import React, {FC, ReactChild, ReactNode} from "react";
import {Layout} from 'antd';
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
            <Content style={{margin: '0 16px'}}>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {children}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>©2021 Learning Platform</Footer>
        </Layout>
    </Layout>
}

export default MainLayout;
