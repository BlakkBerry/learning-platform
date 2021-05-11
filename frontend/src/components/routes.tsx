import MainLayout from "./Main/MainLayout";
import Homepage from "./Main/Homepage/Homepage";
import React from "react";
import NotFoundPage from "./Main/NotFound/NotFoundPage";
import AuthLayout from "./Auth/AuthLayout";
import LoginPage from "./Auth/LoginPage/LoginPage";
import SignupPage from "./Auth/SignupPage/SignupPage";
import Progress from "./Main/Homepage/Progess/Progress";
import Files from "./Main/Homepage/Files/Files";
import CoursePage from "./Main/Homepage/Courses/CoursePage";
import ModulePage from "./Main/Homepage/Courses/Modules/ModulePage";
import LessonPage from "./Main/Homepage/Courses/Modules/Lessons/LessonPage";

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
        path: '/courses/:id',
        exact: true,
        name: 'Course',
        component: CoursePage,
        layout: MainLayout
    },
    {
        path: '/courses/:courseId/modules/:id',
        exact: true,
        name: 'Module',
        component: ModulePage,
        layout: MainLayout
    },
    {
        path: '/courses/:courseId/modules/:moduleId/lessons/:id',
        exact: true,
        name: 'Lesson',
        component: LessonPage,
        layout: MainLayout
    },
    {
        path: '/progress',
        exact: true,
        name: 'Progress',
        component: Progress,
        layout: MainLayout
    },
    {
        path: '/files',
        exact: true,
        name: 'Files',
        component: Files,
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
