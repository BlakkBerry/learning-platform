import React, {useEffect} from 'react';
import {useTypedSelector} from "../../../hooks/useTypedSelector";

const LoginPage = () => {

    useTypedSelector(state => {
        console.log(state.courses.authorCourses.length)
        return state.courses
    })

    useEffect(() => {
        // fetchMaterials()
    }, [])


    return (
        <div>
            Login page!
        </div>
    );
};

export default LoginPage;
