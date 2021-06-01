from users.models import CustomUser


def is_author(user, course_pk):
    course = CustomUser.objects.get(pk=user.pk).course_set.get(pk=course_pk)
    return course.author == user


def is_student(user, course_pk):
    course = CustomUser.objects.get(pk=user.pk).course_set.get(pk=course_pk)
    return user in [student for student in course.students.get_queryset()]
