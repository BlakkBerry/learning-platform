import React, {FC} from 'react';
import {HomeTask} from "../../../../types/hometask";

interface FileProps {
    homeTask: HomeTask
    author: boolean

}

const Files: FC<FileProps> = ({homeTask, author}) => {
    return (
        <div>
            {author &&
            <div>
                {homeTask.file?.map(file => (
                    <div key={file.id}>
                        <a href={file.file_item}>{file.title}</a>
                    </div>
                ))}
            </div>
            }
        </div>
    );
};

export default Files;
