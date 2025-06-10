from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    favourite_pokemon = models.ForeignKey("Pokemon", on_delete=models.SET_NULL, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Pokemon(models.Model):
    external_id = models.CharField(max_length=100, unique=True)
    key = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    sprite_filename = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name.capitalize()
