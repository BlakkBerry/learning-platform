import {useCallback, useEffect, useRef} from "react";
import {TaskDiscussionMessage} from "../types/task";

type sendMessageType = (message: TaskDiscussionMessage) => void
type websocketEventCallbackType = (event: any) => void
type useWebSocketType = (url: string,
                         onMessage: websocketEventCallbackType,
                         onOpen: websocketEventCallbackType | null,
                         onClose: websocketEventCallbackType | null) => sendMessageType

export const useWebSocket: useWebSocketType = (url, onMessage, onOpen = null, onClose = null) => {
    const wsRef = useRef<WebSocket>()

    useEffect(() => {
        wsRef.current = new WebSocket(url)

        wsRef.current.onmessage = onMessage
        wsRef.current.onopen = onOpen
        wsRef.current.onclose = onClose

        return () => {
            wsRef.current?.close()
        }
    }, [])

    return useCallback(message => {
        wsRef.current?.send(JSON.stringify(message))
    }, [wsRef])
};
