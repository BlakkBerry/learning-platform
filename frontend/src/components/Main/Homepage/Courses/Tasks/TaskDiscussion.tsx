import {FC, useEffect, useRef, useState} from "react"
import Cookies from "universal-cookie";
import {TaskDiscussionMessage} from "../../../../../types/task";
import {useWebSocket} from "../../../../../hooks/useWebSocket";
import './TaskDiscussion.css'
import {Avatar, Tooltip, Comment} from "antd";
import moment from "moment";
import Search from "antd/es/input/Search";

interface TaskDiscussionProps {
    courseId: number
    moduleId: number
    lessonId: number
    taskId: number
}

const TaskDiscussion: FC<TaskDiscussionProps> = ({courseId, moduleId, lessonId, taskId}) => {

    const [messages, setMessages] = useState<TaskDiscussionMessage[]>([]);
    const [input, setInput] = useState('')
    const chatRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        chatRef.current!.scrollTo({
            top: Number.MAX_SAFE_INTEGER,
            behavior: "smooth"
        })
    }
    const sendMessage = useWebSocket(`ws://localhost:8000/ws/discussion/${courseId}/${moduleId}/${lessonId}/${taskId}/${new Cookies().get('Token')}/`,
        event => {
            const newMessages: TaskDiscussionMessage[] | TaskDiscussionMessage = JSON.parse(event.data)

            setMessages(prevMessages => {

                // If we already have messages and we got the array of messages - someone else has connected to web socket
                // We don't need to set it to our chat
                if (Array.isArray(newMessages) && prevMessages.length)
                    return prevMessages

                return prevMessages.concat(newMessages)
            })
        }, null, null)

    useEffect(() => {
        messages.length > 0 && scrollToBottom()
    }, [messages])

    return (
        <div className="discussion">
            <div className="chat" ref={chatRef}>
                {!messages.length && <p className="chat_empty">No messages found...</p>}
                {messages.map(message => <Comment
                    key={message.id}
                    author={message.user?.username}
                    avatar={
                        <Avatar
                            src={message.user?.photo || "https://www.pngkit.com/png/full/320-3209421_jianxiong-tao-superintendent-anonymous-person.png"}
                            alt={message.text as string}
                        />
                    }
                    content={
                        <p>
                            {message.text}
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment(message.sent_at).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(message.sent_at).fromNow()}</span>
                        </Tooltip>
                    }
                />)}
            </div>
            <Search placeholder="input message" enterButton="Send" size="large"
                    value={input}
                    onChange={event => setInput(event.target.value)}
                    onSearch={() => {
                        sendMessage(input)
                        setInput('')
                        scrollToBottom()
                    }}
            />
        </div>
    )
}

export default TaskDiscussion
