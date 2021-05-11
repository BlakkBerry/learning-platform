import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Course} from "../../../../../../types/course";
import {Lesson} from "../../../../../../types/lesson";
import {authAxios} from "../../../../../../utils/axios";
import {Button, Input, Spin} from "antd";
import {isAuthor} from "../../../../../../utils/functions";

const LessonPage = () => {
    const {courseId, moduleId, id}: any = useParams()
    const [course, setCourse] = useState<Course>()
    const [lesson, setLesson] = useState<Lesson>()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${courseId}/`).then(res => {
            setCourse(res.data)
        })

        authAxios.get<Lesson>(`/courses/${courseId}/modules/${moduleId}/lessons/${id}/`).then(res => {
            setLesson(res.data)
        })
    }, [])

    if (!lesson) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    const author: boolean = isAuthor(course!)

    return (
        <div className="container">
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Lesson details</h1>

            <Input placeholder="Name" addonBefore="Name" value={lesson.name} disabled={!author} className="detail-input" />
            <Input placeholder="Description" addonBefore="Description" value={lesson.description} disabled={!author} className="detail-input" />
            <Input placeholder="Date" addonBefore="Date" value={lesson.created && new Date(lesson.created!).toUTCString()} disabled className="detail-input" />

            {author && <Button type="primary" block>
                Save
            </Button>}
        </div>
    );
};

export default LessonPage;
