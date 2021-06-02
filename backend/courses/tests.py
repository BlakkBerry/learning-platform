from django.test import TestCase

from .serializer import *


class CoursesTests(TestCase):
    auth_headers = {}

    def setUp(self):
        response = self.client.post('/api/auth/register',
                                    {'email': 'tempmail@mail.com', 'username': 'john.smith',
                                     'password': 'Secret123!'})
        self.auth_headers = {
            'HTTP_AUTHORIZATION': 'Token ' + response.data['token']
        }

    def test_courses(self):
        response = self.client.post('/api/courses/', {'name': 'Test course', 'subject': 'some subject'},
                                    **self.auth_headers)
        course = Course.objects.get(name='Test course', subject='some subject')

        serializer_data = CourseSerializer(course).data

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.data,
            serializer_data,
            'Expected object is not equal to the created one.'
        )

        response = self.client.get(f'/api/courses/{course.id}/', follow=True, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            serializer_data,
            'Expected object is not equal to the created one.'
        )

    def test_negative_courses(self):
        # get courses without authorization header
        response = self.client.get('/api/courses/1/', follow=True)
        self.assertEqual(response.status_code, 401)

        # get non-existing course
        response = self.client.get('/api/courses/0/', follow=True, **self.auth_headers)
        self.assertEqual(response.status_code, 404)
