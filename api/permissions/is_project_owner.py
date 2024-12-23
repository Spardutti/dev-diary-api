from ..models import Todo, Project, DailyNote
from rest_framework.permissions import BasePermission


class IsProjectOwner(BasePermission):
    """
    Permission class to ensure the user owns the entity.
    """

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Todo):
            return obj.project.owner == request.user
        if isinstance(obj, Project):
            return obj.owner == request.user
        if isinstance(obj, DailyNote):
            return obj.project.owner == request.user
        return False