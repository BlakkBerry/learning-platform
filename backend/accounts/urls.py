from django.urls import path
from .views import RegisterAPI, LoginAPI, UserApi
from knox import views as knox_views

urlpatterns = [
    path('register', RegisterAPI.as_view()),
    path('login', LoginAPI.as_view()),
    path('user', UserApi.as_view()),
    path('logut', knox_views.LogoutView.as_view(), name='knox_logout'),
]
