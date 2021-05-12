import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies()

export const authAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        Authorization: `Token ${cookies.get('Token')}`
    }
})
