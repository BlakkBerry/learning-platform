import {FC, useEffect, useState} from "react"
import Cookies from "universal-cookie";
import {TaskDiscussionMessage} from "../../../../../types/task";
import {useWebSocket} from "../../../../../hooks/useWebSocket";

let ws: WebSocket

interface TaskDiscussionProps {
    courseId: number
    moduleId: number
    lessonId: number
    taskId: number
}

const TaskDiscussion: FC<TaskDiscussionProps> = ({courseId, moduleId, lessonId, taskId}) => {

    const [messages, setMessages] = useState<TaskDiscussionMessage[]>([]);
    const sendMessage = useWebSocket(`ws://localhost:8000/ws/discussion/${courseId}/${moduleId}/${lessonId}/${taskId}/${new Cookies().get('Token')}/`,
        (event: any) => {
            const messages: TaskDiscussionMessage[] | TaskDiscussionMessage = JSON.parse(event.data)

            setMessages(prev => prev.concat(messages))
        }, null, null)


    return (
        <div>
            <button onClick={() => sendMessage({text: Date.now()})}>SEND</button>
            {messages.map(msg => <p key={msg.id}>
                {msg.text}
            </p>)}
        </div>
    )
}

export default TaskDiscussion
