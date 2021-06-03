import React from 'react';
import {DesktopOutlined, FileOutlined, RiseOutlined} from "@ant-design/icons";
import {Meta} from "antd/es/list/Item";
import {Card} from "antd";
import './CourseItem.css'

const CourseItem = (course: any) => {

    const images = ['https://i.pinimg.com/originals/23/88/aa/2388aa916452f987fa3c9325212dab3b.png', 'https://storge.pic2.me/cm/2560x1600/734/580bbcdb34b56.jpg', 'https://images.wallpaperscraft.ru/image/minimalizm_nebo_oblaka_solntse_gory_ozero_pejzazh_95458_1366x768.jpg', 'https://lh5.googleusercontent.com/proxy/olr17LGVqA5KB-R5xGlfr95kzFDx0-RUtsBsKBuHQndJl-u1msSfT91GIhjqOu-RaacvwmMDpW1DkULSjz-qyJeDVPMvIBjZCqIiUdcj-s8w4vYO5RWDMMhEXLGSdPip=w1200-h630-p-k-no-nu', 'https://imagesbase.ru/uploads/posts/2015-02/1425118023_imagesbase.ru-1492.jpg', 'https://img1.akspic.ru/previews/0/7/1/1/21170/21170-luna-utro-cifrovoe_iskusstvo-minimalizm-gorizont-x750.jpg']

    return (
        <Card
            hoverable
            cover={
                <img
                    className="card__image"
                    height={200}
                    alt={course.name}
                    src={images[Math.floor(Math.random() * images.length)]}
                />
            }
            actions={[
                <FileOutlined key="setting"/>,
                <RiseOutlined key="edit"/>,
                <DesktopOutlined key="ellipsis"/>,
            ]}
        >
            <Meta
                title={course.name}
                description={course.description}
            />
        </Card>
    );
};

export default CourseItem;
