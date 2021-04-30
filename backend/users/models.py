from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _

from users.managers import CustomUserManager


class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, blank=True, null=True, unique=False)
    email = models.EmailField(_('email address'), unique=True)
    photo = models.TextField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return self.email
