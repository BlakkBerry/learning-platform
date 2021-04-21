import React, {FC, ReactChild, ReactNode} from 'react';
import {Layout} from "antd";
import {Content, Footer, Header} from "antd/es/layout/layout";

interface IProps {
    children: ReactNode | ReactChild
}

const AuthLayout: FC<IProps> = ({children}) => {
    return (
        <Layout>
            <Header>Header</Header>
            <Content>
                {children}
            </Content>
            <Footer>Footer</Footer>
        </Layout>
    );
};

export default AuthLayout;
