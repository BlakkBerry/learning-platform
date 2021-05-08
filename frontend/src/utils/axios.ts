import axios from "axios";

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Token d6439fad9d8ec30e749d20a3889b55d993dddb87c7c4cb1b28933c8f16b350b9`
    }
})
