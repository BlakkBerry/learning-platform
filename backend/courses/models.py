from users.models import CustomUser
from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    subject = models.CharField(max_length=100, null=True)
    section = models.CharField(max_length=100, null=True, blank=True)
    audience = models.CharField(max_length=100, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    students = models.ManyToManyField(CustomUser, blank=True, related_name='courses')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name


class Module(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.course}__{self.name}'


class Lesson(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.module}__{self.name}'


class TaskBase(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    lesson = models.ForeignKey(Lesson, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.lesson}__{self.name}'


class Task(TaskBase):
    owner = models.ForeignKey(CustomUser, related_name='tasks', null=True, on_delete=models.SET_NULL)
    max_score = models.IntegerField()
    due_date = models.DateField()


class HomeTask(TaskBase):
    owner = models.ForeignKey(CustomUser, related_name='home_tasks', on_delete=models.CASCADE)
    assignment = models.ForeignKey(Task, related_name='home_tasks', on_delete=models.CASCADE)
    mark = models.IntegerField(blank=True, null=True)


class ItemBase(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    task = models.ForeignKey(TaskBase, related_name='items', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Text(ItemBase):
    content = models.TextField()


class File(ItemBase):
    file_item = models.FileField(upload_to='files')


class Image(ItemBase):
    image_item = models.FileField(upload_to='images')


class Video(ItemBase):
    url = models.URLField()
