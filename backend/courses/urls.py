from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()
router.register(r'texts', TextAPI, basename='text')
router.register(r'files', FileAPI, basename='file')
router.register(r'images', ImageAPI, basename='image')
router.register(r'videos', VideoAPI, basename='video')
urlpatterns = router.urls

requests_url = [
    path('', CourseRequestAPI.as_view({'get': 'list'})),
    path('<int:rpk>/', CourseRequestAPI.as_view({'get': 'retrieve', 'delete': 'destroy'})),
]

home_tasks_url = [
    path('', HomeTaskAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:htpk>/', HomeTaskAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),

]

tasks_url = [
    path('', TaskAPI.as_view({'get': 'list', 'post': 'create'})),
    path('<int:tpk>/', TaskAPI.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
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

urlpatterns += [
    path('courses/', include(courses_url)),
    path('get_student_bundle/', AllStudentCoursesView.as_view({'get': 'list'})),
    path('get_author_bundle/', AllAuthorCoursesView.as_view({'get': 'list'}))
]
