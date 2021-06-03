from rest_framework import permissions

from .mixins import *
from .serializer import *


class CourseAPI(CreateMixin, AuthorDestroyMixin, AuthorUpdateMixin, mixins.RetrieveModelMixin,
                mixins.ListModelMixin):
    serializer_class = CourseSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_params(self, **kwargs):
        return {"author": self.request.user}

    def get_queryset(self):
        user = self.request.user.id
        return Course.objects.filter(Q(author=user) | Q(students=user)).order_by('id').distinct('id')

    def get_instance(self, **kwargs):
        return get_object_or_404(self.get_queryset(), pk=kwargs['pk'])

    def destroy(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        return super().destroy(request, *args, **kwargs)


class CourseRequestAPI(ListMixin, RetrieveMixin, CreateMixin, AuthorDestroyMixin, mixins.UpdateModelMixin):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.action != 'update':
            return CourseRequestSerializer
        else:
            return CourseAuthorRequestSerializer

    def get_queryset(self, **kwargs):
        return CourseRequest.objects.filter(course__author=self.request.user.id, course__pk=kwargs['pk'])

    def get_instance(self, **kwargs):
        return get_object_or_404(self.get_queryset(**kwargs), pk=kwargs['rpk'])

    def get_params(self, **kwargs):
        return {"course": get_object_or_404(Course, code=self.request.data['code']), "student": self.request.user}

    def update(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        if is_author(self.request.user, kwargs['pk']):
            instance.course.students.add(instance.student)
            instance.course.save()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})


class ModuleAPI(ListMixin, RetrieveMixin, AuthorCreateMixin, AuthorDestroyMixin, AuthorUpdateMixin):
    serializer_class = ModuleSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, **kwargs):
        user = self.request.user.id
        return Module.objects.filter(Q(course__author=user) | Q(course__students=user)).order_by('id') \
            .distinct('id').filter(course=kwargs['pk'])

    def get_instance(self, **kwargs):
        return get_object_or_404(self.get_queryset(**kwargs), pk=kwargs['mpk'])

    def get_params(self, **kwargs):
        return {"course": get_object_or_404(Course, pk=kwargs['pk'])}


class LessonAPI(ListMixin, RetrieveMixin, AuthorCreateMixin, AuthorDestroyMixin, AuthorUpdateMixin):
    serializer_class = LessonSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, **kwargs):
        user = self.request.user.id
        return Lesson.objects.filter(Q(module__course__author=user) | Q(module__course__students=user)) \
            .order_by('id').distinct('id').filter(module__course=kwargs['pk'], module=kwargs['mpk'])

    def get_instance(self, **kwargs):
        return get_object_or_404(self.get_queryset(**kwargs), pk=kwargs['lpk'])

    def get_params(self, **kwargs):
        return {"module": get_object_or_404(Module, pk=kwargs['mpk'], course__pk=kwargs['pk'])}


class TaskAPI(ListMixin, RetrieveMixin, AuthorCreateMixin, AuthorDestroyMixin, AuthorUpdateMixin):
    serializer_class = TaskSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, **kwargs):
        user = self.request.user.id
        return Task.objects.filter(
            Q(lesson__module__course__author=user) | Q(lesson__module__course__students=user)).order_by('id').distinct(
            'id').filter(lesson__module__course=kwargs['pk'], lesson__module=kwargs['mpk'], lesson=kwargs['lpk'])

    def get_instance(self, **kwargs):
        return get_object_or_404(self.get_queryset(**kwargs), pk=kwargs['tpk'])

    def get_params(self, **kwargs):
        return {"lesson": get_object_or_404(Lesson, pk=kwargs['lpk'], module__pk=kwargs['mpk'],
                                            module__course__pk=kwargs['pk'])}

    def create(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save(**self.get_params(**kwargs))

        # Create one-to-one related discussion
        Discussion(task=data).save()
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers={f'{type(data).__name__}_url': f'{request.build_absolute_uri()}{data.id}'})


class HomeTaskAPI(ListMixin, RetrieveMixin, StudentCreateMixin, AuthorDestroyMixin, StudentUpdateMixin):
    serializer_class = HomeTaskSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, **kwargs):
        user = self.request.user
        print(user)
        queryset = HomeTask.objects.filter(
            Q(assignment__lesson__module__course__author=user) |
            Q(assignment__lesson__module__course__students=user)) \
            .order_by('id').distinct('id') \
            .filter(assignment__lesson__module__course__pk=kwargs['pk'], assignment__lesson__module__pk=kwargs['mpk'],
                    assignment__lesson__pk=kwargs['lpk'], assignment__pk=kwargs['tpk'])

        print(queryset)
        if is_student(user, kwargs['pk']):
            print("??????")
            queryset = queryset.filter(owner=user)
        print(queryset)
        return queryset

    def get_instance(self, **kwargs):
        return get_object_or_404(self.get_queryset(**kwargs), pk=kwargs['htpk'])

    def get_params(self, **kwargs):
        return {'assignment': get_object_or_404(Task, pk=kwargs['tpk'], lesson__pk=kwargs['lpk'],
                                                lesson__module__pk=kwargs['mpk'],
                                                lesson__module__course__pk=kwargs['pk']),
                'owner': self.request.user}

    def get_due_date(self, **kwargs):
        return self.get_params(**kwargs)['assignment'].due_date

    def create(self, request, *args, **kwargs):
        if is_student(self.request.user, kwargs['pk']) and len(
                HomeTask.objects.filter(assignment=self.get_params(**kwargs)['assignment'],
                                        owner=self.request.user)) != 0:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'detail': 'you have already created a homework'})

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        if is_student(self.request.user, kwargs['pk']):
            return super().create(request, *args, **kwargs)

        if is_author(self.request.user, kwargs['pk']):
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            mark = Mark.objects.filter(task=instance.assignment, student=instance.owner)

            if len(mark):
                mark = mark.get()
                mark.task = instance.assignment
                mark.student = instance.owner
                mark.score = instance.mark
                mark.max_score = instance.assignment.max_score
                mark.save()
            else:
                mark = Mark(task=instance.assignment, student=instance.owner, score=instance.mark,
                            max_score=instance.assignment.max_score)
                mark.save()
            return Response(serializer.data)


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


class MarkAPI(ListMixin):
    serializer_class = MarkSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self, **kwargs):
        user = self.request.user.id
        queryset = Mark.objects.filter(
            Q(task__lesson__module__course__author=user) |
            Q(task__lesson__module__course__students=user)).order_by('id').distinct('id') \
            .filter(task__lesson__module__course=kwargs['pk'])

        if is_student(self.request.user, kwargs['pk']):
            queryset = queryset.filter(student=self.request.user)

        return queryset


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
