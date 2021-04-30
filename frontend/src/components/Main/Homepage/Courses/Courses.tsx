import React from 'react';
import {List} from "antd";
import Course from "./Course/Course";

const Courses = () => {

    const data = [
        {
            title: 'Title 1',
            image: 'https://ru.react.js.org/logo-og.png'
        },
        {
            title: 'Title 2',
            image: 'https://cdn-images-1.medium.com/max/2000/1*qXcjSfRj0C0ir2yMsYiRyw.jpeg'
        },
        {
            title: 'Title 3'
        },
        {
            title: 'Title 4',
            image: 'https://cdn-images-1.medium.com/max/2000/1*qXcjSfRj0C0ir2yMsYiRyw.jpeg'
        },
        {
            title: 'Title 5',
            image: 'https://ru.react.js.org/logo-og.png'
        },
        {
            title: 'Title 6',
            image: 'https://cdn-images-1.medium.com/max/2000/1*qXcjSfRj0C0ir2yMsYiRyw.jpeg'
        },
        {
            title: 'Title 7'
        },
        {
            title: 'Title 8',
            image: 'https://cdn-images-1.medium.com/max/2000/1*qXcjSfRj0C0ir2yMsYiRyw.jpeg'
        }
    ];


    return <>
        <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Courses</h1>
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
            dataSource={data}
            renderItem={course => (
                <List.Item>
                    <Course {...course}/>
                </List.Item>
            )}
        />
    </>;
};

export default Courses;
