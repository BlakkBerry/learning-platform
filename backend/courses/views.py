from rest_framework import viewsets, permissions
from .serializer import *
from .models import *


class CourseAPI(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class ModuleAPI(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()


class LessonAPI(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    queryset = Lesson.objects.all()


class TaskAPI(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class HomeTaskAPI(viewsets.ModelViewSet):
    serializer_class = HomeTaskSerializer
    queryset = HomeTask.objects.all()


class TextAPI(viewsets.ModelViewSet):
    serializer_class = TextSerializer
    queryset = Text.objects.all()


class FileAPI(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()


class ImageAPI(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    queryset = Image.objects.all()


class VideoAPI(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()
