import {FC, useEffect, useRef, useState} from "react"
import Cookies from "universal-cookie";

const ws = new WebSocket(`ws://localhost:8000/ws/discussion/1/1/1/1/${new Cookies().get('Token')}/`)

const TaskDiscussion: FC = () => {

    useEffect(() => {
        ws.addEventListener('message', event => {
            console.log(event.data)
        })
    }, [])

    return (
        <div>
            <button onClick={() => ws.send(JSON.stringify({text: 'Zdarova papech'}))}>SEND</button>
            Task works
        </div>
    )
}

export default TaskDiscussion
