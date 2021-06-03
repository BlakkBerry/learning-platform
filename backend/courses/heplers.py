from datetime import datetime

from django.shortcuts import get_object_or_404

from users.models import CustomUser


def is_author(user, course_pk):
    course = get_object_or_404(CustomUser, pk=user.pk).course_author.filter(pk=course_pk)
    if len(course):
        return course.get().author == user
    return False


def is_student(user, course_pk):
    course = get_object_or_404(CustomUser, pk=user.pk).course_students.filter(pk=course_pk)
    if len(course):
        return user in [student for student in course.get().students.get_queryset()]
    return False


def in_time(due_date):
    return due_date >= datetime.now().date()
