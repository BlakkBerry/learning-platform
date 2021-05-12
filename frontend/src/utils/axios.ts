import axios from "axios";

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Token e0aeebeb7a5f33aa86c3bd0647ce2e213c6b40e1bfa18a84970953acb493bbb0`
    }
})
