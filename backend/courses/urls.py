from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'courses', CourseAPI, basename='course')
router.register(r'courses_requests', CourseRequestAPI, basename='course_request')
router.register(r'modules', ModuleAPI, basename='module')
router.register(r'lessons', LessonAPI, basename='lesson')
router.register(r'tasks', TaskAPI, basename='task')
router.register(r'home_tasks', HomeTaskAPI, basename='home_task')
router.register(r'texts', TextAPI, basename='text')
router.register(r'files', FileAPI, basename='file')
router.register(r'images', ImageAPI, basename='image')
router.register(r'videos', VideoAPI, basename='video')
urlpatterns = router.urls
