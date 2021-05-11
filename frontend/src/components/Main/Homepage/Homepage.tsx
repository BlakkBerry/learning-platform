import React from 'react';
import Courses from "./Courses/Courses";
import Test from "../../Test";

const Homepage = () => {

    return (
        <div>
            {/*<Test/>*/}
            <Courses isAuthor={false}/>

            <Courses isAuthor={true}/>
        </div>
    );
};

export default Homepage;
