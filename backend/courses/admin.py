from django.contrib import admin
from courses.models import *

# Register your models here.
admin.site.register(Course)
admin.site.register(CourseRequest)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Task)
admin.site.register(HomeTask)
admin.site.register(File)
admin.site.register(Image)
admin.site.register(Text)
admin.site.register(Video)
