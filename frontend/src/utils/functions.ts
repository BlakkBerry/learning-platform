import {Course} from "../types/course";
import Cookies from 'universal-cookie';

export const isAuthor = (course: Course) => {
    const cookies = new Cookies()

    if (!course) {
        return false
    }

    return course.author === parseInt(cookies.get('User_ID'))
}
