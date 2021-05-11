import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Module} from "../../../../../types/module";
import {authAxios} from "../../../../../utils/axios";
import {Button, Input, Spin} from "antd";
import {Course} from "../../../../../types/course";
import {isAuthor} from "../../../../../utils/functions";
import Lessons from "./Lessons/Lessons";

const ModulePage = () => {

    const {courseId, id}: any = useParams()
    const [course, setCourse] = useState<Course>()
    const [module, setModule] = useState<Module>()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${courseId}/`).then(res => {
            setCourse(res.data)
        })

        authAxios.get<Module>(`/courses/${courseId}/modules/${id}/`).then(res => {
            setModule(res.data)
        })
    }, [])

    if (!module) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    const author: boolean = isAuthor(course!)

    return (
        <div className="container">
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Module details</h1>

            <Input placeholder="Name" addonBefore="Name" value={module.name} disabled={!author} className="detail-input" />
            <Input placeholder="Description" addonBefore="Description" value={module.description} disabled={!author} className="detail-input" />
            <Input placeholder="Date" addonBefore="Date" value={module.created && new Date(module.created!).toUTCString()} disabled className="detail-input" />

            {author && <Button type="primary" block>
                Save
            </Button>}

            <Lessons courseId={courseId} moduleId={module.id!}/>
        </div>
    );
};

export default ModulePage;
