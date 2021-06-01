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
        student_r = [request.student.id for request in CourseRequest.objects.filter(course=course)]
        if author in student_r:
            raise serializers.ValidationError('you have already requested this course')
        return value


class DiscussionMessageSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = DiscussionMessage
        fields = '__all__'

    def to_internal_value(self, data):
        user = CustomUser.objects.get(pk=data.get('user'))
        discussion = Discussion.objects.get(pk=data.get('discussion'))

        data['user'] = user
        data['discussion'] = discussion

        return data


class CourseAuthorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRequest
        fields = ''


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        exclude = ('course',)


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        exclude = ('module',)


class TaskTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskText
        exclude = ('task',)


class TaskFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskFile
        exclude = ('task',)


class TaskImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskImage
        exclude = ('task',)


class TaskVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskVideo
        exclude = ('task',)


class TaskSerializer(serializers.ModelSerializer):
    text = TaskTextSerializer(many=True, read_only=True, source='tasktext_set')
    file = TaskFileSerializer(many=True, read_only=True, source='taskfile_set')
    image = TaskImageSerializer(many=True, read_only=True, source='taskimage_set')
    video = TaskVideoSerializer(many=True, read_only=True, source='taskvideo_set')

    class Meta:
        model = Task
        fields = ('id', 'name', 'description', 'max_score', 'due_date', 'text', 'file', 'image', 'video')

    def validate_due_date(self, value):
        if value < datetime.now().date():
            raise serializers.ValidationError('date cannot be past')
        return value

    def validate_max_score(self, value):
        if value <= 0:
            raise serializers.ValidationError('mark cannot be negative')
        return value


class HomeTaskTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTaskText
        exclude = ('task',)


class HomeTaskFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTaskFile
        exclude = ('task',)


class HomeTaskImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTaskImage
        exclude = ('task',)


class HomeTaskVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTaskVideo
        exclude = ('task',)


class HomeTaskSerializer(serializers.ModelSerializer):
    owner = CustomUserSerializer(many=False, read_only=True)
    text = HomeTaskTextSerializer(many=True, read_only=True, source='hometasktext_set')
    file = HomeTaskFileSerializer(many=True, read_only=True, source='hometaskfile_set')
    image = HomeTaskImageSerializer(many=True, read_only=True, source='hometaskimage_set')
    video = HomeTaskVideoSerializer(many=True, read_only=True, source='hometaskvideo_set')

    class Meta:
        model = HomeTask
        fields = ('id', 'owner', 'name', 'mark', 'text', 'file', 'image', 'video',)
        read_only_fields = ('owner',)

    def validate_mark(self, value):
        requested_user = self.context['request'].user
        task = Task.objects.get(pk=self.context.get('request').stream.resolver_match.kwargs['tpk'])

        course_user = task.lesson.module.course.author
        if value is not None and (value < 0 or value > task.max_score):
            raise serializers.ValidationError('value must be in range [0, max score]')
        if value is not None and requested_user != course_user:
            raise serializers.ValidationError("you can't judge yourself")
        return value


class MarkSerializer(serializers.ModelSerializer):
    student = CustomUserSerializer(many=False, read_only=True)

    class Meta:
        model = Mark
        fields = '__all__'
        depth = 1


class UserHomeTaskSerializer(HomeTaskSerializer):
    text = None
    file = None
    image = None
    video = None

    class Meta:
        model = HomeTask
        exclude = ('assignment',)


class UserTaskSetSerializer(TaskSerializer):
    home_task = UserHomeTaskSerializer(many=True, read_only=True, source='hometask_set')

    class Meta:
        model = Task
        fields = ('id', 'name', 'description', 'max_score', 'due_date', 'home_task')


class UserLessonSetSerializer(serializers.ModelSerializer):
    tasks = UserTaskSetSerializer(many=True, read_only=True, source='task_set')

    class Meta:
        model = Lesson
        fields = ('id', 'name', 'description', 'created', 'tasks')
        depth = 1


class UserModuleSetSerializer(serializers.ModelSerializer):
    lessons = UserLessonSetSerializer(many=True, read_only=True, source='lesson_set')

    class Meta:
        model = Module
        fields = ('id', 'name', 'description', 'created', 'lessons')
        depth = 1


class AuthorModuleSetSerializer(UserModuleSetSerializer):
    pass


class StudentTaskSetSerializer(UserTaskSetSerializer):
    home_task = serializers.SerializerMethodField('_get_user_home_tasks', source='hometask_set')

    def _get_user_home_tasks(self, obj):
        request = self.context.get('request', None)
        if request:
            home_task = HomeTask.objects.filter(owner=request.user, assignment=obj.id)
            serializer = UserHomeTaskSerializer(instance=home_task, many=True)

            return serializer.data


class StudentLessonSetSerializer(UserLessonSetSerializer):
    tasks = StudentTaskSetSerializer(many=True, read_only=True, source='task_set')


class StudentModuleSetSerializer(UserModuleSetSerializer):
    lessons = StudentLessonSetSerializer(many=True, read_only=True, source='lesson_set')


class AllAuthorCoursesSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(many=False, read_only=True)
    students = CustomUserSerializer(many=True, read_only=True)
    modules = AuthorModuleSetSerializer(many=True, read_only=True, source='module_set')

    class Meta:
        model = Course
        fields = ('id', 'name', 'description', 'code', 'subject', 'section', 'audience', 'created', 'students',
                  'author', 'modules')


class AllStudentCoursesSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(many=False, read_only=True)
    students = CustomUserSerializer(many=True, read_only=True)
    modules = StudentModuleSetSerializer(many=True, read_only=True, source='module_set')

    class Meta:
        model = Course
        fields = ('id', 'name', 'description', 'code', 'subject', 'section', 'audience', 'created', 'students',
                  'author', 'modules')
