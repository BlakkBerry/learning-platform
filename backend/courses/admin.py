from django.contrib import admin

from courses.models import *

admin.site.register(Course)
admin.site.register(CourseRequest)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Task)
admin.site.register(HomeTask)
admin.site.register(TaskFile)
admin.site.register(TaskImage)
admin.site.register(TaskText)
admin.site.register(TaskVideo)
admin.site.register(HomeTaskFile)
admin.site.register(HomeTaskImage)
admin.site.register(HomeTaskText)
admin.site.register(HomeTaskVideo)
admin.site.register(Mark)
