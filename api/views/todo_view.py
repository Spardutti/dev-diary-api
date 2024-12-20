from rest_framework.permissions import IsAuthenticated
from ..serializers import TodoSerializer
from ..models import Todo, Project
from rest_framework import generics
from django.shortcuts import get_object_or_404
from ..permissions import IsProjectOwner
from rest_framework.exceptions import PermissionDenied


class TodoView(generics.ListCreateAPIView):
    """
    View to list all todos or create a new todo.
    permission_classes = [IsAuthenticated]
    """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    filterset_fields = ['project', 'title', 'completed']

    ordering_fields = ['title', 'created_at', 'updated_at', 'completed'] 
    
    ordering = ['-created_at'] 

    def get_queryset(self):
        """
        Filter todos based on the project passed in the query params.
        Ensure the project belongs to the authenticated user.
        """
        project_id = self.request.query_params.get("project_id") # type: ignore
        user = self.request.user

        project = get_object_or_404(Project, id=project_id, owner=user)

        return Todo.objects.filter(project=project)
    
    def perform_create(self, serializer):
        """
        Validate project ownership during creation.
        """
        project_id = self.request.data.get("project") # type: ignore
        user = self.request.user

        project = get_object_or_404(Project, id=project_id)

        if project.owner != user:
            raise PermissionDenied("You do not have permission to add todos to this project.")

        serializer.save(project=project)

class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]
        

