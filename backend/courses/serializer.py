from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import serializers

from users.serializer import CustomUserSerializer
from .models import *


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('author', 'code',)

    def validate_students(self, value):
        author = self.context['request'].user.id
        data = self.get_initial()
        if str(author) in data['students']:
            raise serializers.ValidationError('the author cannot be a student')
        return value


class CourseRequestSerializer(serializers.ModelSerializer):
    student = CustomUserSerializer(many=False, read_only=True)

    class Meta:
        model = CourseRequest
        fields = ('id', 'student', 'code',)
        read_only_fields = ('student',)
        extra_kwargs = {
            'code': {'write_only': True},
        }

    def validate_code(self, value):
        data = self.get_initial()
        course = get_object_or_404(Course, code=data['code'])
        students = [student.id for student in course.students.all()]
        author = self.context['request'].user.id
        if author == course.author.id or author in students:
            raise serializers.ValidationError('you are already in this course')
        student_r = [request.student.id for request in CourseRequest.objects.all()]
        if author in student_r:
            raise serializers.ValidationError('you have already requested this course')
        return value


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        exclude = ('course',)


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        exclude = ('module',)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ('lesson',)

    def validate_due_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('date cannot be past')
        return value

    def validate_max_score(self, value):
        if value <= 0:
            raise serializers.ValidationError('mark cannot be negative')
        return value


class HomeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTask
        fields = '__all__'
        read_only_fields = ('owner',)

    def validate_assignment(self, value):
        requested_user = self.context['request'].user.id
        task = Task.objects.get(pk=value)
        students = [student.id for student in task.lesson.module.course.students.all()]
        if requested_user not in students and requested_user != task.lesson.module.course.author.id:
            raise serializers.ValidationError('incorrect assignment')
        return value

    def validate_mark(self, value):
        requested_user = self.context['request'].user.id
        task = Task.objects.get(pk=int(self.get_initial().get('assignment')))

        course_user = task.lesson.module.course.author.id
        if value is not None and (value < 0 or value > task.max_score):
            raise serializers.ValidationError('value must be in range [0, max score]')
        if value is not None and requested_user != course_user:
            raise serializers.ValidationError("you can't judge yourself")
        return value


class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class MarkSerializer(serializers.ModelSerializer):
    student = CustomUserSerializer(many=False, read_only=True)

    class Meta:
        model = Mark
        fields = '__all__'
        depth = 1
