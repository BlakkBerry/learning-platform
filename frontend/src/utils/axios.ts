import axios from "axios";

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Token 6bc1a94090fa702a566373f4e7805dedfb2499526470435927f67491df1f9eb0`
    }
})
