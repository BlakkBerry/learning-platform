from django.urls import path, include

from .views import *

requests_url = [
    path('', CourseRequestAPI.as_view({'get': 'list'})),
    path('<int:rpk>/', CourseRequestAPI.as_view({'get': 'retrieve', 'delete': 'destroy', 'put': 'update'})),
]

home_task_text_url = [
    path('', HomeTaskTextAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', HomeTaskTextAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

home_task_file_url = [
    path('', HomeTaskFileAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', HomeTaskFileAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

home_task_images_url = [
    path('', HomeTaskImageAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', HomeTaskImageAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

home_task_video_url = [
    path('', HomeTaskVideoAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', HomeTaskVideoAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

home_tasks_url = [
    path('', HomeTaskAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:htpk>/', HomeTaskAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('<int:htpk>/texts/', include(home_task_text_url)),
    path('<int:htpk>/files/', include(home_task_file_url)),
    path('<int:htpk>/images/', include(home_task_images_url)),
    path('<int:htpk>/video/', include(home_task_video_url)),
]

task_text_url = [
    path('', TaskTextAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', TaskTextAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

task_file_url = [
    path('', TaskFileAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', TaskFileAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

task_image_url = [
    path('', TaskImageAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', TaskImageAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

task_video_url = [
    path('', TaskVideoAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:file_pk>/', TaskVideoAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}))
]

tasks_url = [
    path('', TaskAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:tpk>/', TaskAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('<int:tpk>/texts/', include(task_text_url)),
    path('<int:tpk>/files/', include(task_file_url)),
    path('<int:tpk>/images/', include(task_image_url)),
    path('<int:tpk>/videos/', include(task_video_url)),
    path('<int:tpk>/home_tasks/', include(home_tasks_url))
]

lessons_url = [
    path('', LessonAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:lpk>/', LessonAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('<int:lpk>/tasks/', include(tasks_url))
]

modules_url = [
    path('', ModuleAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:mpk>/', ModuleAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('<int:mpk>/lessons/', include(lessons_url))
]

course_url = [
    path('', CourseAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('requests/', include(requests_url)),
    path('modules/', include(modules_url)),
    path('marks/', MarkAPI.as_view({'get': 'list'})),
]

courses_url = [
    path('', CourseAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:pk>/', include(course_url)),
    path('request/', CourseRequestAPI.as_view({'post': 'create'})),
]

urlpatterns = [
    path('courses/', include(courses_url)),
    path('get_student_bundle/', AllStudentCoursesView.as_view({'get': 'list'})),
    path('get_author_bundle/', AllAuthorCoursesView.as_view({'get': 'list'}))
]
