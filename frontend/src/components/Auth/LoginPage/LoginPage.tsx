import React, {useEffect} from 'react';
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";

const LoginPage = () => {

    useTypedSelector(state => {
        console.log(state.materials.courses.length)
        return state.materials
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
