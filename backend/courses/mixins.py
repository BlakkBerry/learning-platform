import os
from typing import Any

from django.conf import settings
from django.db.models import Q
from rest_framework import status, viewsets, mixins
from rest_framework.response import Response

from .heplers import *
from .serializer import *


class RetrieveMixin(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    def get_instance(self, **kwargs) -> Any:
        pass

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ListMixin(viewsets.GenericViewSet, mixins.ListModelMixin):
    def get_queryset(self, **kwargs) -> Any:
        pass

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset(**kwargs)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CreateMixin(viewsets.GenericViewSet, mixins.CreateModelMixin):
    def get_params(self, **kwargs) -> dict:
        pass

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save(**self.get_params(**kwargs))
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers={f'{type(data).__name__}_url': f'{request.build_absolute_uri()}{data.id}'})


class UpdateMixin(viewsets.GenericViewSet, mixins.UpdateModelMixin):
    def get_instance(self, **kwargs) -> Any:
        pass

    def update(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class DestroyMixin(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    def get_instance(self, **kwargs) -> Any:
        pass

    def destroy(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentCreateMixin(CreateMixin):
    def get_due_date(self, **kwargs):
        pass

    def create(self, request, *args, **kwargs):
        if is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={
                'detail': f'Only students can create ${type(self.serializer_class.Meta.model).__name__}'})

        if is_student(self.request.user, kwargs['pk']):
            if in_time(self.get_due_date(**kwargs)):
                return super().create(request, *args, **kwargs)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class StudentUpdateMixin(UpdateMixin):
    def get_due_date(self, **kwargs):
        pass

    def update(self, request, *args, **kwargs):
        if is_student(self.request.user, kwargs['pk']):
            if in_time(self.get_due_date(**kwargs)):
                return super().update(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class AuthorCreateMixin(CreateMixin):
    def create(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class AuthorUpdateMixin(UpdateMixin):
    def update(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        return super().update(request, *args, **kwargs)


class AuthorDestroyMixin(DestroyMixin):
    def destroy(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        return super().destroy(request, *args, **kwargs)


class RetrieveTaskBaseItemMixin(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    def get_queryset(self, **kwargs):
        pass

    def retrieve(self, request, *args, **kwargs):
        queryset = self.get_queryset(**kwargs)
        instance = get_object_or_404(queryset, pk=kwargs['file_pk'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class DestroyTaskBaseItemMixin(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    def get_instance(self, **kwargs) -> Any:
        pass

    def destroy(self, request, *args, **kwargs):
        instance = self.get_instance(**kwargs)
        if not hasattr(instance, 'file_item'):
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            file_path = os.path.join(settings.BASE_DIR, str(instance.file_item))
            if os.path.exists(file_path):
                os.remove(file_path)
                self.perform_destroy(instance)
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TaskItemBaseMixin(RetrieveTaskBaseItemMixin, ListMixin, CreateMixin, UpdateMixin, DestroyTaskBaseItemMixin):
    base_model = ItemBase

    def get_params(self, **kwargs):
        return {"task": get_object_or_404(Task, lesson__module__course__pk=kwargs['pk'],
                                          lesson__module__pk=kwargs['mpk'],
                                          lesson__pk=kwargs['lpk'],
                                          pk=kwargs['tpk'])}

    def get_queryset(self, **kwargs):
        user = self.request.user
        return self.base_model.objects.filter(
            Q(task__lesson__module__course__author=user) |
            Q(task__lesson__module__course__students=user)).order_by('id').distinct('id') \
            .filter(task__lesson__module__course__pk=kwargs['pk'],
                    task__lesson__module__pk=kwargs['mpk'],
                    task__lesson__pk=kwargs['lpk'],
                    task__pk=kwargs['tpk'])

    def get_instance(self, **kwargs):
        return get_object_or_404(self.base_model, task__lesson__module__course__pk=kwargs['pk'],
                                 task__lesson__module__pk=kwargs['mpk'],
                                 task__lesson__pk=kwargs['lpk'],
                                 task__pk=kwargs['tpk'],
                                 pk=kwargs['file_pk'])

    def create(self, request, *args, **kwargs):
        if is_author(self.request.user, kwargs['pk']):
            return super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        return super().destroy(request, *args, **kwargs)


class HomeTaskItemBaseMixin(RetrieveTaskBaseItemMixin, ListMixin, StudentCreateMixin,
                            StudentUpdateMixin, DestroyTaskBaseItemMixin):
    base_model = ItemBase

    def get_queryset(self, **kwargs):
        user = self.request.user
        queryset = self.base_model.objects.filter(
            Q(task__assignment__lesson__module__course__author=user) |
            Q(task__assignment__lesson__module__course__students=user)).order_by('id').distinct('id') \
            .filter(assignment__lesson__module__course__pk=kwargs['pk'],
                    assignment__lesson__module__pk=kwargs['mpk'],
                    assignment__lesson__pk=kwargs['lpk'],
                    assignment__pk=kwargs['tpk'],
                    pk=kwargs['htpk'])

        if is_student(self.request.user, kwargs['pk']):
            queryset = queryset.filter(task__owner=user)
        return queryset

    def get_instance(self, **kwargs):
        return get_object_or_404(self.base_model, task__assignment__lesson__module__course__pk=kwargs['pk'],
                                 task__assignment__lesson__module__pk=kwargs['mpk'],
                                 task__assignment__lesson__pk=kwargs['lpk'],
                                 task__assignment__pk=kwargs['tpk'],
                                 task__pk=kwargs['htpk'],
                                 pk=kwargs['file_pk'])

    def get_params(self, **kwargs):
        return {'task': get_object_or_404(HomeTask, assignment__lesson__module__course__pk=kwargs['pk'],
                                          assignment__lesson__module__pk=kwargs['mpk'],
                                          assignment__lesson__pk=kwargs['lpk'],
                                          assignment__pk=kwargs['tpk'],
                                          pk=kwargs['htpk'])}

    def get_due_date(self, **kwargs):
        return self.get_params(**kwargs)['task'].assignment.due_date

    def list(self, request, *args, **kwargs):
        if len(self.get_queryset(**kwargs)) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
        super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        if self.get_params(**kwargs)['task'].owner == self.request.user:
            return super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        if is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'detail': 'Only students can modify files to homeworks.'})

        if is_student(self.request.user, kwargs['pk']) and self.get_instance(**kwargs).task.owner == self.request.user:
            return super().update(request, *args, **kwargs)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        if is_author(self.request.user, kwargs['pk']):
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'detail': 'Only students can delete files to homeworks.'})

        if is_student(self.request.user, kwargs['pk']):
            return super().destroy(request, *args, **kwargs)
        return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': 'Not found.'})
