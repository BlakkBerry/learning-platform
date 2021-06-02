from datetime import datetime

from django.shortcuts import get_object_or_404

from users.models import CustomUser


def is_author(user, course_pk):
    course = get_object_or_404(get_object_or_404(CustomUser, pk=user.pk).course_set, pk=course_pk)
    return course.author == user


def is_student(user, course_pk):
    course = get_object_or_404(get_object_or_404(CustomUser, pk=user.pk).course_set, pk=course_pk)
    return user in [student for student in course.students.get_queryset()]


def in_time(due_date):
    return due_date >= datetime.now().date()
