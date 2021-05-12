import React, {FC, ReactChild, ReactNode} from 'react';
import {Layout} from "antd";
import {Content} from "antd/es/layout/layout";
import "./utils.css"
import "./AuthLayout.css"

interface IProps {
    children: ReactNode | ReactChild
}

const AuthLayout: FC<IProps> = ({children}) => {
    return (
        <Layout>
            <Content>
                {children}
            </Content>
        </Layout>
    );
};

export default AuthLayout;
