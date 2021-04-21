import MainLayout from "./MainLayout";
import Homepage from "./Homepage/Homepage";
import React from "react";
import NotFoundPage from "./NotFound/NotFoundPage";

type Route = {
    path: string
    exact?: boolean
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
    }
]

export default routes