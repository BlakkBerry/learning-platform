from users.models import CustomUser
from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    section = models.CharField(max_length=100)
    audience = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    students = models.ManyToManyField(CustomUser, related_name='courses')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Topic(models.Model):
    name = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    name = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class ItemBase(models.Model):
    owner = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=250)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

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


class Task(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    max_score = models.IntegerField()
    due_date = models.DateField()
    owner = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL)
    items = models.ForeignKey(ItemBase, null=True, on_delete=models.SET_NULL)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Homework(models.Model):
    owner = models.ForeignKey(CustomUser, related_name='homeworks', on_delete=models.CASCADE)
    items = models.ForeignKey(ItemBase, null=True, on_delete=models.SET_NULL)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    mark = models.IntegerField()

    def __str__(self):
        return f"Homework for {self.task} by {self.owner.email}"
