import axios from "axios";

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Bearer ZDAROVA`
    }
})
