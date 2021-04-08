from rest_framework import viewsets, permissions, status, mixins
from rest_framework.response import Response
from django.db.models import Q
from .serializer import *
from .models import *


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
                       mixins.RetrieveModelMixin,
                       mixins.ListModelMixin,
                       mixins.DestroyModelMixin,
                       mixins.CreateModelMixin):
    serializer_class = CourseRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user = self.request.user.id
        return CourseRequest.objects.filter(course__author=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = get_object_or_404(Course, code=request.data['code'])
        serializer.save(student=request.user, course=course)
        return Response(status=status.HTTP_200_OK)


class ModuleAPI(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


class LessonAPI(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    queryset = Lesson.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


class TaskAPI(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


class HomeTaskAPI(viewsets.ModelViewSet):
    serializer_class = HomeTaskSerializer
    queryset = HomeTask.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]


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
