from rest_framework import serializers

from .models import *


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('author',)

    def validate_students(self, value):
        author = self.context['request'].user.id
        data = self.get_initial()
        if str(author) in data['students']:
            raise serializers.ValidationError('the author cannot be a student')
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
