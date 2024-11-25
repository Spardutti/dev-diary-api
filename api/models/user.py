from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email: str, password: str, **extra_fields):
        """
        Creates and returns a regular user with the given email and password.
        """
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
            """
            Creates and returns a superuser with the given email and password.
            """
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)

            if extra_fields.get('is_staff') is not True:
                raise ValueError("Superuser must have is_staff=True.")
            if extra_fields.get('is_superuser') is not True:
                raise ValueError("Superuser must have is_superuser=True.")

            return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, max_length=255)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_visited_project = models.ForeignKey('Project', null=True, blank=True, on_delete=models.SET_NULL, related_name='users_last_visited')
    is_guest = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email
