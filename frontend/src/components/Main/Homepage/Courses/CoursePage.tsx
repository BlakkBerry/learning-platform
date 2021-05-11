import React, {useEffect, useState} from 'react';
import {
    useParams
} from "react-router-dom";
import {authAxios} from "../../../../utils/axios";
import {Course} from "../../../../types/course";
import Modules from "./Modules/Modules";
import {Button, Input, Spin} from "antd";
import {isAuthor} from "../../../../utils/functions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";


const CoursePage = () => {

    const {id}: any = useParams()
    let [course, setCourse] = useState<Course | null>(null)
    const {requests, error, loading} = useTypedSelector(state => state.requests)
    const {fetchCourseRequests} = useActions()

    useEffect(() => {
        authAxios.get<Course>(`/courses/${id}/`).then(res => {
            setCourse(res.data)
        })

        fetchCourseRequests(id)

    }, [])

    if (!course) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    const author: boolean = isAuthor(course)

    return (
        <div className="container">
            <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Course details</h1>

            <Input placeholder="Name" addonBefore="Name" value={course.name} disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Subject" addonBefore="Subject" value={course.subject} disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Section" addonBefore="Section" value={course.section} disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Description" addonBefore="Description" value={course.description} disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Audience" addonBefore="Audience" value={course.audience} disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Code" addonBefore="Code" value={course.code} disabled={!author}
                   className="detail-input"/>
            <Input placeholder="Number of students" addonBefore="Students" value={course.students.length}
                   disabled={!author} className="detail-input"/>

            {author && <Button type="primary" block>
                Save
            </Button>}



            <Modules courseId={id}/>
        </div>
    );
};

export default CoursePage;
