from ..models import Todo, Project
from rest_framework.permissions import BasePermission


class IsProjectOwner(BasePermission):
    """
    Permission class to ensure the user owns the project or todo.
    """

    def has_object_permission(self, request, view, obj):
        print('oBJ', obj)
        if isinstance(obj, Todo):
            return obj.project.owner == request.user
        if isinstance(obj, Project):
            print('asdasdasd', obj.owner)
            return obj.owner == request.user
        return False