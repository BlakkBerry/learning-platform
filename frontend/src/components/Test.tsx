import React, {useEffect} from "react";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";

const TestComponent: React.FC = () => {
    const {users, loading, error} = useTypedSelector(state => state.user)
    const {fetchUsers} = useActions()

    useEffect(() => {
        fetchUsers()
    }, [])

    if (loading) {
        return <div style={{color: 'blue'}}>Loading...</div>
    }

    if (error) {
        return <div style={{color: 'red'}}>Error!</div>
    }

    return <div>
        <ul>
            {users.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
    </div>
}

export default TestComponent