import React, {FC, useEffect} from 'react';
import {useTypedSelector} from "../../../../../../hooks/useTypedSelector";
import {useActions} from "../../../../../../hooks/useActions";
import {List, Spin} from "antd";
import {Link} from "react-router-dom";
import LessonItem from "./LessonItem/LessonItem";

interface LessonsProps {
    courseId: number,
    moduleId: number
}

const Lessons: FC<LessonsProps> = ({courseId, moduleId}) => {
    const {lessons, loading, error} = useTypedSelector(state => state.lessons)
    const {fetchLessons} = useActions()

    useEffect(() => {
        fetchLessons(courseId, moduleId)
    }, [])

    if (error) {
        return <h1 color="red">{error}</h1>
    }

    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    return <>
        <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Lessons</h1>
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4
            }}
            dataSource={lessons}
            renderItem={lesson => (
                    <List.Item>
                        <Link to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}>
                            <LessonItem {...lesson}/>
                        </Link>
                    </List.Item>
                )
            }
        />
    </>;
};

export default Lessons;
