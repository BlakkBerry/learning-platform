import axios from "axios";

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Token b63db74c67a36b753d3a07aa8db693b28acc15bc39965b8a4a29b3bcca6aa0ca`
    }
})
