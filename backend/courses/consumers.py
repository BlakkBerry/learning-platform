import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from knox.auth import TokenAuthentication
from rest_framework import HTTP_HEADER_ENCODING
from rest_framework.exceptions import AuthenticationFailed

from .models import Discussion
from .serializer import DiscussionMessageSerializer


class TaskDiscussionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        params = self.scope['url_route']['kwargs']

        knoxAuth = TokenAuthentication()

        try:
            user, token = await sync_to_async(knoxAuth.authenticate_credentials) \
                (params['token'].encode(HTTP_HEADER_ENCODING))
            self.scope['user'] = user
            self.scope['discussion'] = params['task_id']

            await self.accept()
        except AuthenticationFailed:
            await self.close()

        self.discussion_group_name = f"discussion_group_" \
                                     f"{params['course_id']}_" \
                                     f"{params['module_id']}_" \
                                     f"{params['lesson_id']}_" \
                                     f"{params['task_id']}"

        await self.channel_layer.group_add(self.discussion_group_name, self.channel_name)

        messages = await self.get_messages(params['task_id'])

        await self.channel_layer.group_send(self.discussion_group_name, {
            'type': 'send_messages',
            'messages': messages
        })

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.discussion_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)

            message = await self.create_message(data)

            await self.channel_layer.group_send(self.discussion_group_name, {
                'type': 'send_message',
                'message': message
            })

    async def send_messages(self, event):
        await self.send(text_data=json.dumps(event['messages']))

    async def send_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @sync_to_async
    def get_messages(self, pk):
        discussion = Discussion.objects.get(pk=pk)
        messages = discussion.messages.all()
        serializer = DiscussionMessageSerializer(messages, many=True)

        return serializer.data

    @sync_to_async
    def create_message(self, message):
        message['user'] = self.scope['user'].id
        message['discussion'] = self.scope['discussion']

        serializer = DiscussionMessageSerializer(data=message)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return serializer.data
