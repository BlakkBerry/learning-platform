from rest_framework import permissions

from .mixins import *
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
        if is_author(self.request.user, kwargs['pk']):
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'Authentication credentials were not provided.'})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CourseRequestAPI(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.action != 'update':
            return CourseRequestSerializer
        else:
            return CourseAuthorRequestSerializer

    def get_queryset(self):
        return CourseRequest.objects.filter(course__author=self.request.user.id)

    def get_instance(self, **kwargs):
        return get_object_or_404(CourseRequest, course__pk=kwargs['pk'], pk=kwargs['rpk'])

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(course=kwargs['pk'])
        instance = get_object_or_404(queryset, pk=kwargs['rpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        course = get_object_or_404(Course, pk=kwargs['pk'], author=self.request.user.id)
        queryset = self.get_queryset().filter(course=course)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        if is_author(self.request.user, kwargs['pk']):
            instance.course.students.add(instance.student)
            instance.course.save()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = get_object_or_404(Course, code=request.data['code'])
        serializer.save(student=request.user, course=course)
        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        if is_author(self.request.user, kwargs['pk']):
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})


class ModuleAPI(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return Module.objects.filter(
            Q(course__author=user) |
            Q(course__students=user)) \
            .order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(course=kwargs['pk'])
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
        return Lesson.objects.filter(
            Q(module__course__author=user) |
            Q(module__course__students=user)) \
            .order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user.id

        module = get_object_or_404(Module, pk=kwargs['mpk'], course__pk=kwargs['pk'])

        queryset = self.get_queryset().filter(
            Q(module=module, module__course__students=user) |
            Q(module=module, module__course__author=user))

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
            Q(lesson__module__course__author=user) |
            Q(lesson__module__course__students=user)) \
            .order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user.id
        lesson = get_object_or_404(Lesson,
                                   pk=kwargs['lpk'],
                                   module__pk=kwargs['mpk'],
                                   module__course__pk=kwargs['pk'])

        queryset = self.get_queryset().filter(
            Q(lesson=lesson, lesson__module__course__students=user)
            | Q(lesson=lesson, lesson__module__course__author=user))

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

        # Create one-to-one related discussion
        Discussion(task=task).save()

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
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return HomeTask.objects.filter(
            Q(assignment__lesson__module__course__author=user) |
            Q(assignment__lesson__module__course__students=user)) \
            .order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user

        task = get_object_or_404(Task,
                                 pk=kwargs['tpk'],
                                 lesson__pk=kwargs['lpk'],
                                 lesson__module__pk=kwargs['mpk'],
                                 lesson__module__course__pk=kwargs['pk'])

        queryset = self.get_queryset().filter(
            Q(assignment=task, assignment__lesson__module__course__students=user) |
            Q(assignment=task, assignment__lesson__module__course__author=user))
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

        students = [student for student in
                    get_object_or_404(self.get_queryset(),
                                      pk=kwargs['htpk']).assignment.lesson.module.course.students.get_queryset()]
        if user in students:
            queryset = queryset.filter(owner=user)
        instance = get_object_or_404(queryset, pk=kwargs['htpk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        task = Task.objects.filter(pk=kwargs['tpk'])

        if not task:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        task = task.get()

        if request.user == task.lesson.module.course.author:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Only students can do homework.'})

        students = [student for student in task.lesson.module.course.students.get_queryset()]
        if request.user in students:
            if task.due_date >= datetime.now().date():
                if len(HomeTask.objects.filter(assignment=task, owner=request.user)) != 0:
                    return Response(status=status.HTTP_400_BAD_REQUEST,
                                    data={'detail': 'you have already created a homework'})
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=False)
                homework = serializer.save(owner=request.user, assignment=task)
                return Response(serializer.data, status=status.HTTP_201_CREATED,
                                headers={'course_url': f'{request.build_absolute_uri()}{homework.id}'})

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(HomeTask,
                                     pk=kwargs['htpk'],
                                     assignment__pk=kwargs['tpk'],
                                     assignment__lesson__pk=kwargs['lpk'],
                                     assignment__lesson__module__pk=kwargs['mpk'],
                                     assignment__lesson__module__course__pk=kwargs['pk'])

        students = [student for student in instance.assignment.lesson.module.course.students.get_queryset()]
        if request.user in students:
            instance = self.get_queryset().filter(pk=kwargs['htpk'],
                                                  assignment__pk=kwargs['tpk'],
                                                  assignment__lesson__pk=kwargs['lpk'],
                                                  assignment__lesson__module__pk=kwargs['mpk'],
                                                  assignment__lesson__module__course__pk=kwargs['pk'],
                                                  owner=request.user)
            if not instance:
                return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
            instance = instance.get()
            if instance.assignment.due_date >= datetime.now().date():
                serializer = self.get_serializer(instance, data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)
                return Response(serializer.data)

        if request.user == instance.assignment.lesson.module.course.author:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            instance = self.get_queryset().filter(pk=kwargs['htpk'],
                                                  assignment__pk=kwargs['tpk'],
                                                  assignment__lesson__pk=kwargs['lpk'],
                                                  assignment__lesson__module__pk=kwargs['mpk'],
                                                  assignment__lesson__module__course__pk=kwargs['pk']).get()

            m = Mark.objects.filter(task=instance.assignment, student=instance.owner)

            if len(m):
                m = m.get()
                m.task = instance.assignment
                m.student = instance.owner
                m.score = instance.mark
                m.max_score = instance.assignment.max_score
                m.save()
            else:
                mark = Mark(task=instance.assignment, student=instance.owner, score=instance.mark,
                            max_score=instance.assignment.max_score)
                mark.save()
            return Response(serializer.data)

        return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})

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


class TaskTextAPI(TaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = TaskTextSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = TaskText


class TaskFileAPI(TaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = TaskFileSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = TaskFile


class TaskImageAPI(TaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = TaskImageSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = TaskImage


class TaskVideoAPI(TaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = TaskVideoSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = TaskVideo


class HomeTaskTextAPI(HomeTaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = HomeTaskTextSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = HomeTaskText


class HomeTaskFileAPI(HomeTaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = HomeTaskFileSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = HomeTaskFile


class HomeTaskImageAPI(HomeTaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = HomeTaskImageSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = HomeTaskImage


class HomeTaskVideoAPI(HomeTaskItemBaseMixin, viewsets.GenericViewSet):
    serializer_class = HomeTaskVideoSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]
    base_model = HomeTaskVideo


class MarkAPI(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = MarkSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return Mark.objects.filter(
            Q(task__lesson__module__course__author=user) |
            Q(task__lesson__module__course__students=user)) \
            .order_by('id').distinct('id')

    def list(self, request, *args, **kwargs):
        user = self.request.user

        course = get_object_or_404(Course, pk=kwargs['pk'])

        queryset = self.get_queryset().filter(
            Q(task__lesson__module__course=course, task__lesson__module__course__students=user) |
            Q(task__lesson__module__course=course, task__lesson__module__course__author=user))

        if not is_student(self.request.user, kwargs['pk']) and not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        if is_student(self.request.user, kwargs['pk']):
            queryset = queryset.filter(student=user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AllAuthorCoursesView(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = AllAuthorCoursesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Course.objects.filter(author=self.request.user)


class AllStudentCoursesView(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = AllStudentCoursesSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Course.objects.filter(students=self.request.user)
