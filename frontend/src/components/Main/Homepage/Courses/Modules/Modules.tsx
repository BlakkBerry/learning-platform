import React, {FC, useEffect} from 'react';
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {useActions} from "../../../../../hooks/useActions";
import {List, Spin} from "antd";
import {Link} from "react-router-dom";
import ModuleItem from "./ModuleItem/ModuleItem";

interface ModulesProps {
    courseId: number
}

const Modules: FC<ModulesProps> = ({courseId}) => {
    const {modules, loading, error} = useTypedSelector(state => state.modules)
    const {fetchModules} = useActions()

    useEffect(() => {
        fetchModules(courseId)
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
        <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Modules</h1>
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
            dataSource={modules}
            renderItem={module => (
                <List.Item>
                    <Link to={`/courses/${courseId}/modules/${module.id}`}>
                        <ModuleItem {...module}/>
                    </Link>
                </List.Item>
            )}
        />
    </>;
};

export default Modules;
