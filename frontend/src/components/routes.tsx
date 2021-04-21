import MainLayout from "./Main/MainLayout";
import Homepage from "./Main/Homepage/Homepage";
import React from "react";
import NotFoundPage from "./Main/NotFound/NotFoundPage";
import AuthLayout from "./Auth/AuthLayout";
import LoginPage from "./Auth/LoginPage/LoginPage";
import SignupPage from "./Auth/SignupPage/SignupPage";

type Route = {
    path: string
    exact?: boolean
    isPrivate?: boolean
    name: string
    component: any
    layout: React.FC<any> | React.ComponentClass<any>
}

const routes: Array<Route> = [
    {
        path: '/',
        exact: true,
        name: 'Homepage',
        component: Homepage,
        layout: MainLayout
    },
    {
        path: '/notfound',
        exact: true,
        name: 'Page not found',
        component: NotFoundPage,
        layout: MainLayout
    },



    // Auth
    {
        path: '/login',
        exact: true,
        name: 'Login page',
        component: LoginPage,
        layout: AuthLayout
    },
    {
        path: '/signup',
        exact: true,
        name: 'Signup page',
        component: SignupPage,
        layout: AuthLayout
    }
]

export default routes