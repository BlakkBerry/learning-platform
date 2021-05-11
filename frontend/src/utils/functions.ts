import {Course} from "../types/course";

export const isAuthor = (course: Course) => {
    if (!course) {
        return false
    }

    return course.author === 1 // TODO change to saved author id
}
