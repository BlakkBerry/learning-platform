from django.db.models import Q
from rest_framework import viewsets, permissions, status, mixins
from rest_framework.response import Response

from .serializer import *


class CourseAPI(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return Course.objects.filter(Q(author=user) | Q(students=user)).order_by('id').distinct('id')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers={'course_url': f'{request.build_absolute_uri()}{course.id}'})

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user == instance.author:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'Authentication credentials were not provided.'})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user != instance.author:
            students = [student for student in instance.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseRequestAPI(viewsets.GenericViewSet,
                       mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.DestroyModelMixin,
                       mixins.CreateModelMixin):
    serializer_class = CourseRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return CourseRequest.objects.filter(course__author=user)

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(course=kwargs['pk'])
        instance = get_object_or_404(queryset, pk=kwargs['rpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        user = self.request.user.id
        course = get_object_or_404(Course, pk=kwargs['pk'], author=user)
        queryset = self.get_queryset().filter(course=course)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = get_object_or_404(Course, code=request.data['code'])
        serializer.save(student=request.user, course=course)
        return Response(status=status.HTTP_200_OK)


class ModuleAPI(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return Module.objects.filter(Q(course__author=user) | Q(course__students=user)).order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user.id
        course = get_object_or_404(Course,
                                   Q(pk=kwargs['pk'], author=user) | Q(pk=kwargs['pk'], students=user))
        queryset = self.get_queryset().filter(course=course)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(course=kwargs['pk'])
        instance = get_object_or_404(queryset, pk=kwargs['mpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        course = get_object_or_404(Course, pk=kwargs['pk'])
        if course.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'Authentication credentials were not provided.'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        module = serializer.save(course=course)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers={'course_url': f'{request.build_absolute_uri()}{module.id}'})

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Module, pk=kwargs['mpk'], course__pk=kwargs['pk'])

        if request.user != instance.course.author:
            students = [student for student in instance.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(Module, pk=kwargs['mpk'], course__pk=kwargs['pk'])
        if request.user != instance.course.author:
            students = [student for student in instance.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class LessonAPI(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return Lesson.objects.filter(Q(module__course__author=user) | Q(module__course__students=user)).order_by(
            'id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user.id

        module = get_object_or_404(Module,
                                   Q(pk=kwargs['mpk'],
                                     course__pk=kwargs['pk'],
                                     course__author=user) |
                                   Q(pk=kwargs['mpk'],
                                     course__pk=kwargs['pk'],
                                     course__students=user))

        queryset = self.get_queryset().filter(module=module)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(module__course=kwargs['pk'], module=kwargs['mpk'])
        instance = get_object_or_404(queryset, pk=kwargs['lpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        course = get_object_or_404(Course, pk=kwargs['pk'])
        module = get_object_or_404(Module, pk=kwargs['mpk'], course__pk=kwargs['pk'])
        if course.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'Authentication credentials were not provided.'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lesson = serializer.save(module=module)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers={'course_url': f'{request.build_absolute_uri()}{lesson.id}'})

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Lesson, pk=kwargs['lpk'], module__pk=kwargs['mpk'],
                                     module__course__pk=kwargs['pk'])

        if request.user != instance.module.course.author:
            students = [student for student in instance.module.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(Lesson, pk=kwargs['lpk'], module__pk=kwargs['mpk'],
                                     module__course__pk=kwargs['pk'])
        if request.user != instance.module.course.author:
            students = [student for student in instance.module.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskAPI(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return Task.objects.filter(
            Q(lesson__module__course__author=user) | Q(lesson__module__course__students=user)).order_by('id').distinct(
            'id')

    def list(self, request, *args, **kwargs):
        user = self.request.user.id
        lesson = get_object_or_404(Lesson,
                                   Q(pk=kwargs['lpk'],
                                     module__pk=kwargs['mpk'],
                                     module__course__pk=kwargs['pk'],
                                     module__course__author=user) |
                                   Q(pk=kwargs['lpk'],
                                     module__pk=kwargs['mpk'],
                                     module__course__pk=kwargs['pk'],
                                     module__course__students=user))

        queryset = self.get_queryset().filter(lesson=lesson)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(lesson__module__course=kwargs['pk'], lesson__module=kwargs['mpk'],
                                              lesson=kwargs['lpk'])
        instance = get_object_or_404(queryset, pk=kwargs['tpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        course = get_object_or_404(Course, pk=kwargs['pk'])
        lesson = get_object_or_404(Lesson, pk=kwargs['lpk'], module__pk=kwargs['mpk'], module__course__pk=kwargs['pk'])
        if course.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'Authentication credentials were not provided.'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save(lesson=lesson)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers={'course_url': f'{request.build_absolute_uri()}{task.id}'})

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Task, pk=kwargs['tpk'], lesson__pk=kwargs['lpk'], lesson__module__pk=kwargs['mpk'],
                                     lesson__module__course__pk=kwargs['pk'])

        if request.user != instance.lesson.module.course.author:
            students = [student for student in instance.lesson.module.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(Task, pk=kwargs['tpk'], lesson__pk=kwargs['lpk'], lesson__module__pk=kwargs['mpk'],
                                     lesson__module__course__pk=kwargs['pk'])
        if request.user != instance.lesson.module.course.author:
            students = [student for student in instance.lesson.module.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class HomeTaskAPI(viewsets.ModelViewSet):
    serializer_class = HomeTaskSerializer
    queryset = HomeTask.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return HomeTask.objects.filter(
            Q(assignment__lesson__module__course__author=user) | Q(
                assignment__lesson__module__course__students=user)).order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user

        task = get_object_or_404(Task,
                                 Q(pk=kwargs['tpk'],
                                   lesson__pk=kwargs['lpk'],
                                   lesson__module__pk=kwargs['mpk'],
                                   lesson__module__course__pk=kwargs['pk'],
                                   lesson__module__course__author=user) |
                                 Q(
                                     pk=kwargs['tpk'],
                                     lesson__pk=kwargs['lpk'],
                                     lesson__module__pk=kwargs['mpk'],
                                     lesson__module__course__pk=kwargs['pk'],
                                     lesson__module__course__students=user))

        queryset = self.get_queryset().filter(assignment=task)

        students = [student for student in task.lesson.module.course.students.get_queryset()]

        if user in students:
            queryset = queryset.filter(owner=user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.request.user
        queryset = self.get_queryset().filter(assignment__lesson__module__course=kwargs['pk'],
                                              assignment__lesson__module=kwargs['mpk'],
                                              assignment__lesson=kwargs['lpk'],
                                              assignment=kwargs['tpk'])
        course = get_object_or_404(Course,
                                   Q(pk=kwargs['pk'], author=user) | Q(pk=kwargs['pk'], students=user))
        students = [student for student in course.students.get_queryset()]
        if user in students:
            queryset = queryset.filter(owner=user)
        instance = get_object_or_404(queryset, pk=kwargs['htpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        task = Task.objects.filter(pk=request.data['assignment']).get()
        if not task:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user == task.lesson.module.course.author:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Only students can do homework.'})

        students = [student for student in task.lesson.module.course.students.get_queryset()]
        if request.user in students:
            if task.due_date >= datetime.now().date():
                if len(HomeTask.objects.filter(assignment=task, owner=request.user)) != 0:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'detail': 'you have already created a homework'})
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                homework = serializer.save(owner=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED,
                                headers={'course_url': f'{request.build_absolute_uri()}{homework.id}'})

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_queryset().filter(assignment__lesson__module__course=kwargs['pk'],
                                                  assignment__lesson__module=kwargs['mpk'],
                                                  assignment__lesson=kwargs['lpk'],
                                                  assignment=kwargs['tpk'],
                                                  pk=kwargs['htpk'])
        except HomeTask.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        students = [student for student in instance.get().assignment.lesson.module.course.students.get_queryset()]
        if request.user in students:
            instance = instance.filter(owner=request.user).get()
            if instance.assignment.due_date >= datetime.now().date():
                serializer = self.get_serializer(instance, data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                return Response(serializer.data)
        if request.user == instance.assignment.lesson.module.course.author:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(HomeTask, pk=kwargs['htpk'],
                                     assignment__pk=kwargs['tpk'],
                                     assignment__lesson__pk=kwargs['lpk'],
                                     assignment__lesson__module__pk=kwargs['mpk'],
                                     assignment__lesson__module__course__pk=kwargs['pk'])
        if request.user != instance.assignment.lesson.module.course.author:
            students = [student for student in instance.assignment.lesson.module.course.students.get_queryset()]
            if request.user in students:
                return Response(status=status.HTTP_403_FORBIDDEN,
                                data={'detail': 'Authentication credentials were not provided.'})
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TextAPI(viewsets.ModelViewSet):
    serializer_class = TextSerializer
    queryset = Text.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


class FileAPI(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


class ImageAPI(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    queryset = Image.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


class VideoAPI(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


# class MarkAPI(viewsets.ReadOnlyModelViewSet):
#     permissions = permissions.IsAuthenticated
#     serializer_class = MarkSerializer
#
#     def retrieve(self, request, *args, **kwargs):
#         course = get_object_or_404(Course, pk=kwargs['pk'])
#         students = [student.id for student in course.students.all()]
#         author = self.request.user.id
#
#         if author == course.author.id or author in students:
#             return Response({'status': 'ok', })
#
#         return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

class MarkAPI(viewsets.ReadOnlyModelViewSet):
    serializer_class = MarkSerializer
    queryset = Mark.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def retrieve(self, request, *args, **kwargs):
        # check if it`s author of the course
        super().retrieve(request, *args, **kwargs)
        # students = Course.objects.get(**kwargs).students.all()
        # print(CustomUser.objects.get(pk=self.request.user.id).task_set.all())  # all user tasks
        # print([student.home_task_set.all() for student in students])  # all student homework

        # return Response(status=status.HTTP_200_OK)
