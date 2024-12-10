from rest_framework.views import APIView
from rest_framework import status
from ..serializers import ProjectSerializer
from ..models import Project, User
from ..utils.custom_response import CustomResponse
from ..utils.error_response import ErrorResponse
from rest_framework.permissions import IsAuthenticated

class ProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        try:
                
            if pk is not None:
                project = Project.objects.get(pk=pk, owner=request.user)

                request.last_visited_project = project
                request.user.save(update_fields=['last_visited_project'])
                
                serializer = ProjectSerializer(project)
                return CustomResponse(serializer.data, status=status.HTTP_200_OK)
            
            projects = Project.objects.filter(owner=request.user)
            serializer = ProjectSerializer(projects, many=True)
        
            return CustomResponse(serializer.data, status=status.HTTP_200_OK)
        
        except Project.DoesNotExist:
            return ErrorResponse("Projects not found", status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        try:
            serializer = ProjectSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(owner=request.user)
                return CustomResponse(serializer.data, status=status.HTTP_201_CREATED)

            return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError:
            return ErrorResponse("Invalid data", status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, pk=None):
        try:
            if pk is None:
                return ErrorResponse("Project ID is required", status=status.HTTP_400_BAD_REQUEST)

            project = Project.objects.get(pk=pk)
            serializer = ProjectSerializer(project, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return CustomResponse(serializer.data, status=status.HTTP_200_OK)

            return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Project.DoesNotExist:
            return ErrorResponse("Project not found", status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk=None):
        try:
            if pk is None:
                return ErrorResponse("Project ID is required", status=status.HTTP_400_BAD_REQUEST)
            
            project = Project.objects.get(pk=pk)
            user = project.owner

            project.delete()

            redirect_to = Project.objects.filter(owner=user).first()
            
            return CustomResponse({"redirect_to": redirect_to.id }, status=status.HTTP_200_OK) # type: ignore
        
        except Project.DoesNotExist:
            return ErrorResponse("Project not found", status=status.HTTP_404_NOT_FOUND)