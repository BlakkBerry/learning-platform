from django.shortcuts import get_object_or_404
from rest_framework import serializers

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
    class Meta:
        model = CourseRequest
        fields = '__all__'
        read_only_fields = ('student', 'course',)
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
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class HomeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTask
        fields = '__all__'


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
