import axios from "axios";

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Token 2c34d09974b85bf1e584e07cd209ae8007b971c611ea0908543fe7eb7b273abd`
    }
})
