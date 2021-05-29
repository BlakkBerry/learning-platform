from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from . import consumers

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            routes=[
                re_path(
                    r'ws/discussion/(?P<course_id>\d+)/(?P<module_id>\d+)/(?P<lesson_id>\d+)/(?P<task_id>\d+)/(?P<token>.+)/$',
                    consumers.TaskDiscussionConsumer.as_asgi())
            ]

            # ws://localhost:8000/ws/discussion/1/1/1/1/
        )
    )
})
